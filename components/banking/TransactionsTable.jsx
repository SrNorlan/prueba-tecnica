"use client";

export default function TransactionsTable({ rows = [] }) {
  // Helpers de lectura robusta
  const getDesc = (r) =>
    r.description || r.concept || r.details || r.bank_description || r.motive || "—";

  const getDebit = (r) =>
    r.debit || r.debits || (String(r.type).toLowerCase() === "debit" ? r.amount : "") || "";

  const getCredit = (r) =>
    r.credit || r.credits || (String(r.type).toLowerCase() === "credit" ? r.amount : "") || "";

  const getBalance = (r) => r.balance || r.balanceStr || "";

  const getDate = (r) => r.date || r.dateStr || "";

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Descripción</th>
            <th className="px-4 py-3">Débito</th>
            <th className="px-4 py-3">Crédito</th>
            <th className="px-4 py-3">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={r.number ? `${r.number}-${i}` : i} className="text-gray-900">
              <td className="px-4 py-3 whitespace-nowrap">{getDate(r)}</td>
              <td className="px-4 py-3">{getDesc(r)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-red-600">{getDebit(r)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-emerald-700">{getCredit(r)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{getBalance(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
