"use client";
import Card from "../ui/Card";

export default function CreditCard({
  brand = "BANCO LAFISE",
  // admite ambas variantes:
  holderName,                 // preferida (Dashboard la usa)
  name,                       // compatibilidad hacia atrás
  number,                     // número completo (enmascarado en UI)
  last4,                      // alternativa: últimos 4
  expire = "06/26",
  color = "from-emerald-900 to-emerald-700",
}) {
  // Nombre a mostrar (holderName; si no, name; si no, "Titular")
  const displayName = holderName || name || "Titular";

  const displayNumber =
    number
      ? String(number)
      : last4
      ? `•••• •••• •••• ${String(last4).slice(-4)}`
      : "•••• •••• •••• ••••";

  return (
    <Card className="p-0 overflow-hidden">
      <div className={`h-40 text-white p-6 rounded-2xl bg-gradient-to-br ${color}`}>
        <div className="text-xs font-semibold">{brand}</div>

        <div className="mt-6 text-xl font-mono tracking-widest">
          {displayNumber}
        </div>

        <div className="mt-6 flex items-center justify-between text-[12px] opacity-90">
          <span className="truncate">{displayName}</span>
          <div className="text-right">
            <div className="uppercase text-[11px] leading-3">Expire date</div>
            <div>{expire}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
