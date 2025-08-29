const stepsBase = [
  { id: 1, title: "Cuenta origen" },
  { id: 2, title: "Cuenta destino" },
  { id: 3, title: "Monto a transferir" },
  { id: 4, title: "Datos adicionales" },
  { id: 5, title: "Resumen" },
];
export default function StepIndicator({ step=1 }) {
  return (
    <div className="px-6 pt-6">
      <ol className="flex items-center justify-between gap-4">
        {stepsBase.map((s, i) => {
          const done = step > s.id;
          const current = step === s.id;
          return (
            <li key={s.id} className="flex-1">
              <div className="flex items-center">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs
                  ${done||current ? "bg-emerald-700 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {done ? "✓" : s.id}
                </span>
                <div className="ml-3">
                  <div className="text-[11px] text-gray-500">Paso {s.id}</div>
                  <div className={`text-sm ${current ? "text-emerald-800 font-semibold" : "text-gray-700"}`}>{s.title}</div>
                </div>
              </div>
              {i < stepsBase.length-1 && (
                <div className={`h-0.5 mt-3 ${step > s.id ? "bg-emerald-600" : "bg-gray-200"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
