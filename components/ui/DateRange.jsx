"use client";

export default function DateRange({ from, to, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        Filtrar por rango de fechas
      </span>

      {/* Inputs lado a lado */}
      <div className="flex items-center gap-3">
        <input
          type="date"
          className="w-40 px-3 py-2 rounded-lg shadow-sm border border-gray-200
                     focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm"
          value={from || ""}
          onChange={(e) => onChange({ from: e.target.value, to })}
        />

        <span className="text-gray-400">—</span>

        <input
          type="date"
          className="w-40 px-3 py-2 rounded-lg shadow-sm border border-gray-200
                     focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm"
          value={to || ""}
          onChange={(e) => onChange({ from, to: e.target.value })}
        />
      </div>
    </div>
  );
}
