"use client";
import { useEffect, useState } from "react";
import { getAccountTx } from "../lib/api";

export function useTransactions(accountId) {
  const [state, setState] = useState({
    loading: false,
    error: null,
    page: 1,
    size: 10,
    total: 0,
    items: [],
  });

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!accountId) {
        setState({ loading: false, error: null, page: 1, size: 10, total: 0, items: [] });
        return;
      }
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const res = await getAccountTx(accountId);
        // El mock devuelve 1 item con fecha reciente; normalizamos
        const items = Array.isArray(res?.items) ? res.items : [];
        if (!alive) return;
        setState({
          loading: false,
          error: null,
          page: Number(res?.page || 1),
          size: Number(res?.size || items.length),
          total: Number(res?.total_count || items.length),
          items,
        });
      } catch (e) {
        if (!alive) return;
        setState((s) => ({ ...s, loading: false, error: e.message || String(e) }));
      }
    }
    load();
    return () => { alive = false; };
  }, [accountId]);

  return state; // retorna loading, error, page, size, total, items
}
