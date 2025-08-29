export default function Panel({ className="", children }) {
  return <section className={`bg-white rounded-2xl shadow-sm ${className}`}>{children}</section>;
}
