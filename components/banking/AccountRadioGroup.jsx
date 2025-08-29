"use client";

export default function AccountRadioGroup({ accounts = [], value, onChange, label = "Selecciona una cuenta" }) {
  return (
    <div>
      <div className="text-sm mb-2 text-gray-700">{label}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {accounts.map((a) => {
          const selected = String(value) === String(a.id);
          const visibleNumber = String(a.display_number || a.account_number || a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onChange(a.id)}
              className={[
                "text-left rounded-xl p-4 border transition relative",
                selected
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-semibold">
                  {a.alias || (a.currency === "NIO" || a.currency === "C$" ? "NIO Cuenta" : `${a.currency} Cuenta`)}
                </div>
                <div className={[
                  "h-4 w-4 rounded-full border",
                  selected ? "bg-emerald-600 border-emerald-600" : "border-gray-300"
                ].join(" ")} />
              </div>
              <div className="mt-1 text-sm text-gray-600">{visibleNumber}</div>
              <div className="mt-3 text-[13px]">
                <span className="text-gray-500 mr-1">Saldo:</span>
                <b>
                  {(Number(a.balance || 0)).toLocaleString("es-NI")}{" "}
                  {a.currency === "NIO" ? "C$" : a.currency}
                </b>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
