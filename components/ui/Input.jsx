export default function Input({ label, hint, className="", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm mb-1 text-gray-700">{label}</span>}
      <input
        className={`w-full rounded-lg bg-gray-50 focus:bg-white border border-transparent focus:border-emerald-300 outline-none px-3 py-2 text-sm ${className}`}
        {...props}
      />
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
