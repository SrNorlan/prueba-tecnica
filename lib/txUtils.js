// Devuelve etiqueta de moneda para UI usando siemprela moneda de la cuenta
function accountCurrencyLabel(account) {
  const c = (account?.currency || "").toUpperCase();
  if (c === "NIO" || c === "C$") return "C$"; // Córdoba
  if (c === "USD" || c === "$") return "USD";
  return c || "C$";
}

// Ordena por timestamp descendente
function sortDescByTs(arr) {
  return [...arr].sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0));
}

export function rowsForAllAccounts(items = [], accounts = []) {
  // Mapa: cuentaId - saldo actual
  const balById = {};
  for (const a of accounts) balById[String(a.id)] = Number(a.balance || 0);

  // Agrupar por cuentaId
  const groups = {};
  for (const tx of items) {
    const id = String(tx.__accountId || "");
    if (!groups[id]) groups[id] = [];
    groups[id].push(tx);
  }

  const out = [];

  for (const [accId, list] of Object.entries(groups)) {
    // Ordenar DESC por fecha real
    list.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    // Cursor comienza en el saldo ACTUAL de esa cuenta
    let cursor = balById[accId] ?? 0;

    const account = accounts.find(a => String(a.id) === String(accId));
    const uiCurr = accountCurrencyLabel(account);

    for (const tx of list) {
      const type = String(tx.transaction_type || "").toLowerCase(); 
      const val  = Number(tx?.amount?.value || 0);


      const ts = new Date(tx.transaction_date).getTime();

      // Balance mostrado = saldo después de esa transacción (corriente)
      const rowBalance = cursor;

      // Avanzar cursor hacia atrás en el tiempo (preparando la siguiente fila)
      cursor += type === "debit" ? -val : +val;

      // Fecha formateada (string)
      const dateStr = new Date(tx.transaction_date).toLocaleString("es-NI", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
      });

      const desc =
        tx.description ||
        tx.bank_description ||
        tx.concept ||
        tx.details ||
        tx.motive ||
        "—";

      // Cadenas para mostrar
      const debitStr   = type === "debit"  ? `${uiCurr} ${val.toLocaleString("es-NI")}` : "";
      const creditStr  = type === "credit" ? `${uiCurr} ${val.toLocaleString("es-NI")}` : "";
      const balanceStr = `${uiCurr} ${rowBalance.toLocaleString("es-NI")}`;

      out.push({
        // Campos base
        number: tx.transaction_number,
        description: desc,
        type: tx.transaction_type,
        date: dateStr,
        origin: tx.origin,
        destination: tx.destination,
        // Montos
        debit: debitStr,
        credit: creditStr,
        balance: balanceStr,
        // Alias para máxima compatibilidad con la tabla
        concept: desc,
        debits: debitStr,
        credits: creditStr,
        amount: debitStr || creditStr, // por si la tabla espera un solo campo
        dateStr: dateStr,
        balanceStr: balanceStr,
        ts,
        accountId: accId,
      });
    }
  }

  // Mezclamos todas las cuentas y ordenamos correctamente por timestamp
  return sortDescByTs(out);
}
