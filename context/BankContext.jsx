"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUser, getAccount, createTransaction } from "../lib/api";

const ADJ_KEY = "balanceAdjustments";
const LTX_KEY = "localTransactions"; 

function readJSON(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function writeJSON(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
}

function readAdjustments() { return readJSON(ADJ_KEY, {}); }
function writeAdjustments(obj) { writeJSON(ADJ_KEY, obj); }

function readLocalTx() { return readJSON(LTX_KEY, {}); }
function writeLocalTx(obj) { writeJSON(LTX_KEY, obj); }

const BankContext = createContext(null);

export function BankProvider({ children, userId = "1" }) {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [user,    setUser]    = useState(null);
  const [accountsRaw, setAccountsRaw] = useState([]);
  const [adjustments, setAdjustments] = useState({});
  const [localTxMap, setLocalTxMap] = useState({}); 

  // Carga inicial
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true); setError(null);
        const u = await getUser(userId);
        const productIds = (u?.products || []).filter(p => p.type === "Account").map(p => String(p.id));
        const details = await Promise.all(productIds.map(id => getAccount(id)));
        if (!alive) return;

        const combined = details.map((acc, i) => ({
          ...acc,
          id: productIds[i],
          original_account_number: acc?.account_number ?? "",
        }));
        const counts = combined.reduce((m,a)=>{
          const key = String(a.original_account_number||"");
          m[key] = (m[key]||0)+1;
          return m;
        },{});
        const normalized = combined.map(a=>({
          ...a,
          display_number: counts[String(a.original_account_number||"")] > 1 ? a.id : a.original_account_number,
        }));

        setUser(u);
        setAccountsRaw(normalized);
        setAdjustments(readAdjustments());
        setLocalTxMap(readLocalTx());
      } catch (e) {
        setError(e.message || String(e));
        setUser(null);
        setAccountsRaw([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [userId]);

  // Cuentas con saldo ajustado
  const accounts = useMemo(() => {
    return accountsRaw.map(a => ({
      ...a,
      balance: Number(a.balance || 0) + Number(adjustments[a.id] || 0),
    }));
  }, [accountsRaw, adjustments]);

  const accountsSorted = useMemo(() => {
    return [...accounts].sort((a,b)=>{
      const pa = a.currency === "NIO" || a.currency === "C$" ? 0 : 1;
      const pb = b.currency === "NIO" || b.currency === "C$" ? 0 : 1;
      return pa - pb;
    });
  }, [accounts]);

  const userName = user?.full_name || "";

  // Helpers: agregar transacción local a una cuenta
  function appendLocalTx(accountId, tx) {
    const id = String(accountId);
    const next = readLocalTx();
    next[id] = [tx, ...(next[id] || [])];
    writeLocalTx(next);
    setLocalTxMap(next);
  }

  // Acción: realizar transferencia (POST al mock + actualizar saldos + crear TX locales en ambas cuentas)
  async function makeTransfer({ originId, destId, amount, meta }) {
    const origin = accountsRaw.find(a => String(a.id) === String(originId));
    const dest   = accountsRaw.find(a => String(a.id) === String(destId));
    const value  = Number(amount);

    if (!origin || !dest) throw new Error("Cuentas no válidas.");
    if (!(value > 0))     throw new Error("El monto debe ser mayor que 0.");
    if (value > (Number(origin.balance) + Number(adjustments[origin.id]||0)))
      throw new Error("El monto excede el saldo disponible.");

    const amountCurrency = "NIO";
    const payload = {
      amountCurrency,
      amountValue: value,
      origin: String(origin.account_number || origin.id),
      destination: String(dest.account_number || dest.id),
    };

    // POST al mock (no persiste, pero se utiliza como confirmacion)
    const res = await createTransaction(payload);

    // Ajustar saldos globales
    const nextAdj = { ...readAdjustments() };
    nextAdj[origin.id] = Number(nextAdj[origin.id] || 0) - value;
    nextAdj[dest.id]   = Number(nextAdj[dest.id]   || 0) + value;
    writeAdjustments(nextAdj);
    setAdjustments(nextAdj);

    // Crear dos TX locales (una Debit en origen, una Credit en destino)
    const nowISO = new Date().toISOString();
    const txNumber = String(res?.transaction_number || Math.floor(Math.random()*999999));

    const txOrigin = {
      transaction_number: txNumber,
      description: meta?.conceptoDebito || "Transferencia",
      bank_description: "Transferencia",
      transaction_type: "Debit",
      amount: { currency: amountCurrency, value },
      origin: String(origin.account_number || origin.id),
      destination: String(dest.account_number || dest.id),
      transaction_date: nowISO,
    };
    const txDest = {
      transaction_number: txNumber,
      description: meta?.conceptoCredito || meta?.conceptoDebito || "Transferencia",
      bank_description: "Transferencia",
      transaction_type: "Credit",
      amount: { currency: amountCurrency, value },
      origin: String(origin.account_number || origin.id),
      destination: String(dest.account_number || dest.id),
      transaction_date: nowISO,
    };

    appendLocalTx(origin.id, txOrigin);
    appendLocalTx(dest.id, txDest);

    return res;
  }

  const value = {
    loading, error,
    user, userName,
    accounts: accountsSorted,
    rawAccounts: accountsRaw,
    localTxMap,                 
    makeTransfer,
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank debe usarse dentro de <BankProvider>");
  return ctx;
}
