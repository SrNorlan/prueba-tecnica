"use client";
import { useEffect, useMemo, useState } from "react";
import CreditCard from "../components/banking/CreditCard";
import AccountTile from "../components/banking/AccountTile";
import TransactionsTable from "../components/banking/TransactionsTable";
import Card from "../components/ui/Card";
import { useAccounts } from "../hooks/useAccounts";
import { useBank } from "../context/BankContext";
import { getAccountTx } from "../lib/api";
import { rowsForAllAccounts } from "../lib/txUtils";

export default function Page() {
  // Cuentas desde el estado global
  const { loading: loadingAcc, error: errorAcc, accounts } = useAccounts("1");
  // userName + transacciones locales desde el contexto
  const { userName, localTxMap } = useBank();

  // Cargar transacciones del mock para TODAS las cuentas
  const [loadingTx, setLoadingTx] = useState(false);
  const [errorTx, setErrorTx] = useState(null);
  const [apiItems, setApiItems] = useState([]);

  useEffect(() => {
    let alive = true;
    async function loadAll() {
      if (!accounts?.length) { setApiItems([]); return; }
      try {
        setLoadingTx(true); setErrorTx(null);
        const list = await Promise.all(
          accounts.map(a =>
            getAccountTx(a.id).then(res => ({
              accountId: a.id,
              items: Array.isArray(res?.items) ? res.items : [],
            }))
          )
        );
        if (!alive) return;
        const merged = list.flatMap(block =>
          block.items.map(tx => ({ ...tx, __accountId: block.accountId }))
        );
        setApiItems(merged);
      } catch (e) {
        if (!alive) return;
        setErrorTx(e.message || String(e));
        setApiItems([]);
      } finally {
        setLoadingTx(false);
      }
    }
    loadAll();
    return () => { alive = false; };
  }, [accounts]);

  // Mezclar MOCK + LOCALES (para que aparezcan al instante)
  const allItems = useMemo(() => {
    const locals = Object.entries(localTxMap).flatMap(([accId, list]) =>
      (list || []).map(tx => ({ ...tx, __accountId: accId }))
    );
    return [...apiItems, ...locals];
  }, [apiItems, localTxMap]);

  // Mapear a filas y tomar 5 más recientes para no sobrecargar el dashboard
  const recentRows = useMemo(() => {
    const all = rowsForAllAccounts(allItems, accounts);
    return all.slice(0, 5);
  }, [allItems, accounts]);

  // Paleta para tarjetas (ciclo)
  const gradients = [
    "from-indigo-600 to-indigo-800",
    "from-emerald-600 to-emerald-800",
    "from-neutral-900 to-neutral-700",
    "from-sky-600 to-sky-800",
  ];

  return (
    <div className="space-y-10">
      {/* Mis tarjetas (UNA por CUENTA real, nombre del titular = userName) */}
      <section>
        <h2 className="text-xl font-bold mb-4">Mis tarjetas</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loadingAcc && [0,1,2].map(i=>(
            <Card key={i} className="p-5 animate-pulse">
              <div className="h-28 w-full bg-gray-200 rounded-xl" />
            </Card>
          ))}

          {!loadingAcc && accounts.length > 0 ? (
            accounts.map((a, i) => {
              const num = String(a.display_number || a.account_number || a.id);
              const last4 = num.slice(-4).padStart(4, "•");
              const brand = a.currency === "NIO" || a.currency === "C$" ? "Córdoba" : a.currency;

              return (
                <CreditCard
                  key={a.id || i}
                  color={gradients[i % gradients.length]}
                  holderName={userName || "Titular"}
                  brand={brand}
                  last4={last4}
                />
              );
            })
          ) : (
            <Card className="p-5">
              <div className="text-sm text-gray-600">No hay tarjetas para mostrar.</div>
            </Card>
          )}
        </div>
      </section>

      {/* Cuentas*/}
      <section>
        <h2 className="text-xl font-bold mb-4">Cuentas</h2>

        {errorAcc && (
          <div className="rounded-2xl bg-red-50 text-red-700 p-4">
            Error al cargar cuentas: {errorAcc}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loadingAcc && [0,1,2].map(i=>(
            <Card key={i} className="p-5 animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
              <div className="h-6 w-28 bg-gray-200 rounded mb-4" />
              <div className="h-5 w-40 bg-gray-200 rounded" />
            </Card>
          ))}

          {!loadingAcc && accounts.map((a,i)=>(
            <AccountTile
              key={a.id || i}
              title={`${a.currency === "NIO" || a.currency === "C$" ? "NIO" : a.currency} Cuenta`}
              number={String(a.display_number || a.account_number || a.id)}
              balance={`${a.currency === "NIO" || a.currency === "C$" ? "C$" : a.currency} ${Number(a.balance).toLocaleString("es-NI")}`}
              flag={a.currency === "NIO" || a.currency === "C$" ? "/flags/nicaragua.png" : "/flags/usa.png"}
            />
          ))}
        </div>
      </section>

      {/* Transacciones recientes (mock + locales) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Transacciones recientes</h2>
          <a className="text-sm text-gray-600 hover:text-gray-900" href="/history">Ver todas</a>
        </div>

        {errorTx && (
          <div className="rounded-2xl bg-red-50 text-red-700 p-4">
            Error al cargar transacciones: {errorTx}
          </div>
        )}

        {loadingTx ? (
          <Card className="p-6 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            {[0,1,2].map(i=>(
              <div key={i} className="h-5 w-full bg-gray-200 rounded mb-2" />
            ))}
          </Card>
        ) : (
          <Card className="p-0">
            <TransactionsTable rows={recentRows} />
          </Card>
        )}
      </section>
    </div>
  );
}
