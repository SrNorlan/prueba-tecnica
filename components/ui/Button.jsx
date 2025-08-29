export default function Button({ children, variant="primary", className="", ...props }) {
  const base = "px-5 py-2 rounded-lg text-sm font-medium";
  const styles = {
    primary: "bg-emerald-800 text-white hover:bg-emerald-900",
    ghost: "bg-white border border-emerald-800 text-emerald-800 hover:bg-emerald-50",
    muted: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
}
