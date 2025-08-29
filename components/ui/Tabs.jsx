"use client";
export default function Tabs({ tabs=[], value, onChange }) {
  return (
    <div className="flex gap-4">
      {tabs.map(t => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={[
              "px-4 py-2 rounded-lg text-sm",
              active ? "bg-emerald-50 text-emerald-800" : "text-gray-600 hover:bg-gray-50"
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
