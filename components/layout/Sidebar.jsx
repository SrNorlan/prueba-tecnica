"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { id: "tablero",   href: "/",          label: "Tablero" },
  { id: "transfer",  href: "/transfer",  label: "Transferir" },
  { id: "history",   href: "/history",   label: "Mis transacciones" },
  { id: "pagar",     href: "#pagar",     label: "Pagar" },
  { id: "gestionar", href: "#gestionar", label: "Gestionar" },
  { id: "cheques",   href: "#cheques",   label: "Cheques" },
  { id: "paganet",   href: "#paganet",   label: "Paganet" },
  { id: "admin",     href: "#admin",     label: "Administrar" },
  { id: "ahorro",    href: "#ahorro",    label: "Ahorro automático" },
  { id: "config",    href: "#config",    label: "Configuración" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-72 bg-white shadow-sm">
      <div className="p-6 flex-1 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <img src="/logo1.png" className="h-12 w-auto" alt="BANCO LAFISE" />
        </div>

        <nav className="flex-1 space-y-1 text-[15px]">
          {items.map(({ id, href, label }) => {
            const active =
              href !== "/" ? pathname.startsWith(href) : pathname === "/";
            return (
              <Link
                key={id}
                href={href}
                className={[
                  "flex items-center justify-between px-3 py-2 rounded-lg transition",
                  active
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <span className={["h-2 w-2 rounded-full",
                    active ? "bg-emerald-500" : "bg-gray-300"].join(" ")} />
                  {label}
                </span>
                <span className={active ? "text-emerald-600" : "text-gray-400"}>▸</span>
              </Link>
            );
          })}
        </nav>

        {/* Tasa de cambio*/}
        <div className="rounded-2xl bg-white shadow-sm p-4 text-sm">
          <div className="font-semibold mb-2">Tasa de cambio</div>
          <div className="flex gap-2">
            <select className="rounded-lg px-2 py-1 text-xs bg-gray-50">
              <option>Córdoba</option>
            </select>
            <select className="rounded-lg px-2 py-1 text-xs bg-gray-50">
              <option>USD</option>
            </select>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-gray-50 p-2 text-center">
              <div className="text-[11px] text-gray-500">NIO</div>
              <div className="font-semibold">35.1</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-2 text-center">
              <div className="text-[11px] text-gray-500">USD</div>
              <div className="font-semibold">35.95</div>
            </div>
          </div>
          <div className="mt-4 text-[11px] text-gray-500 leading-4">
            <div>IP del Servidor: 190.432.574.23</div>
            <div>Último acceso: 2021/11/21 13:32:11</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
