"use client";
import { useEffect, useMemo, useState } from "react";
import Panel from "../../components/ui/Panel";
import Tabs from "../../components/ui/Tabs";
import DateRange from "../../components/ui/DateRange";
import TransactionsTable from "../../components/banking/TransactionsTable";
import Card from "../../components/ui/Card";
import { useAccounts } from "../../hooks/useAccounts";
import { useBank } from "../../context/BankContext";
import { getAccountTx } from "../../lib/api";
import { rowsForAllAccounts } from "../../lib/txUtils";

const TABS = [
  { value: "mov", label: "Movimientos" },
  { value: "estado", label: "Estado" },
  { value: "detalle", label: "Detalle" },
  { value: "fnd", label: "Fondo no Disponible" },
];

// utilidades internas
function toDateSafe(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export default function HistoryPage() {
  const [tab, setTab] = useState("mov");
  const [range, setRange] = useState({ from: "", to: "" });

  // Cuentas (estado global)
  const { loading: loadingAcc, error: errorAcc, accounts } = useAccounts("1");

  // Transacciones locales (generadas al transferir) desde el contexto
  const { localTxMap } = useBank();

  // Transacciones del mock (API)
  const [loadingTx, setLoadingTx] = useState(false);
  const [errorTx, setErrorTx] = useState(null);
  const [apiItems, setApiItems] = useState([]);

  // Cargar transacciones de TODAS las cuentas desde el mock
  useEffect(() => {
    let alive = true;
    async function loadAll() {
      if (!accounts?.length) { setApiItems([]); return; }
      try {
        setLoadingTx(true);
        setErrorTx(null);
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

  // Mezclar mock + locales
  const allItems = useMemo(() => {
    const locals = Object.entries(localTxMap).flatMap(([accId, list]) =>
      (list || []).map(tx => ({ ...tx, __accountId: accId }))
    );
    return [...apiItems, ...locals];
  }, [apiItems, localTxMap]);

  // Filtro por fechas (incluye el día "Hasta")
  const filtered = useMemo(() => {
    const f = toDateSafe(range.from);
    const t0 = toDateSafe(range.to);
    const t = t0 ? endOfDay(t0) : null;
    return (allItems || []).filter((tx) => {
      const d = toDateSafe(tx?.transaction_date);
      if (!d) return false;
      if (f && d < f) return false;
      if (t && d > t) return false;
      return true;
    });
  }, [allItems, range]);

  // Mapear a filas con descripción, débito/crédito y balance por fila
  const rows = useMemo(() => rowsForAllAccounts(filtered, accounts), [filtered, accounts]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mis Transacciones</h1>

      <Panel className="p-6">
        {/* Encabezado: Tabs + Filtro de Fechas (tu diseño) */}
        <div className="flex items-center justify-between mb-4">
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          <DateRange from={range.from} to={range.to} onChange={setRange} />
        </div>

        {/* Contenido por pestaña */}
        {tab === "mov" ? (
          <>
            {errorAcc && (
              <div className="rounded-xl bg-red-50 text-red-700 p-3 mb-3">
                Error al cargar cuentas: {errorAcc}
              </div>
            )}
            {errorTx && (
              <div className="rounded-xl bg-red-50 text-red-700 p-3 mb-3">
                Error al cargar transacciones: {errorTx}
              </div>
            )}

            {loadingAcc || loadingTx ? (
              <Card className="p-6 animate-pulse">
                <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
                {[0,1,2,3].map(i => <div key={i} className="h-5 w-full bg-gray-200 rounded mb-2" />)}
              </Card>
            ) : rows.length === 0 ? (
              <Card className="p-6">
                <div className="text-sm text-gray-600">No hay transacciones en este rango de fechas.</div>
              </Card>
            ) : (
              <TransactionsTable rows={rows} />
            )}
          </>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-10 text-center text-sm text-gray-500">
            Próximamente: {TABS.find(t=>t.value===tab)?.label}
          </div>
        )}
      </Panel>
    </div>
  );
}
