export default function Card({ as:Tag="div", className="", children, ...props }) {
  return (
    <Tag className={`bg-white rounded-2xl shadow-sm ${className}`} {...props}>
      {children}
    </Tag>
  );
}
