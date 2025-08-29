export default function Select({ label, options=[], className="", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm mb-1 text-gray-700">{label}</span>}
      <select
        className={`w-full rounded-lg bg-gray-50 focus:bg-white border border-transparent focus:border-emerald-300 outline-none px-3 py-2 text-sm appearance-none ${className}`}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
