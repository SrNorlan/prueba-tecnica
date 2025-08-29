// components/layout/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

/** ===== Iconos inline (sin dependencias) ===== **/
function Icon({ name, active = false }) {
  const cls = `h-4 w-4 ${active ? "text-emerald-600" : "text-gray-400"}`;
  switch (name) {
    case "tablero": // Home
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9Z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-6h6v6"/>
        </svg>
      );
    case "transfer": // Arrows left-right
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h12m0 0-3-3m3 3-3 3M17 17H5m0 0 3-3m-3 3 3 3"/>
        </svg>
      );
    case "history": // Clock/History
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 3-6.708M3 4v5h5"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 1.5"/>
        </svg>
      );
    case "pagar": // Credit card
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <path d="M3 9h18M7 13h4M7 16h3"/>
        </svg>
      );
    case "gestionar": // Settings sliders
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" d="M4 7h10M4 17h16M14 7l3-3m-3 3 3 3M10 17l-3-3m3 3-3 3"/>
        </svg>
      );
    case "cheques": // Receipt
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 3h12a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2-3-2V4a1 1 0 0 1 1-1Z"/>
          <path d="M8 7h8M8 10h8M8 13h5"/>
        </svg>
      );
    case "paganet": // Globe
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9"/>
          <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>
        </svg>
      );
    case "admin": // Shield
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3 5 6v6a9 9 0 0 0 7 8 9 9 0 0 0 7-8V6l-7-3Z"/>
          <path d="M9.5 12l1.5 1.5 3.5-3.5"/>
        </svg>
      );
    case "ahorro": // Piggy bank
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 11a6 6 0 0 1 6-6h3a5 5 0 0 1 5 5v2h2v3h-3.2a5.5 5.5 0 0 1-5.3 4H10a6 6 0 0 1-5-3H3v-3h2V11Z"/>
          <circle cx="14.5" cy="9.5" r="0.8" />
        </svg>
      );
    case "config": // Cog
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
          <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.02.02a2 2 0 1 1-2.83 2.83l-.02-.02a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.06 1.65V21a2 2 0 1 1-4 0v-.02a1.8 1.8 0 0 0-1.06-1.65 1.8 1.8 0 0 0-1.98.36l-.02.02a2 2 0 1 1-2.83-2.83l.02-.02A1.8 1.8 0 0 0 5 15.4a1.8 1.8 0 0 0-1.65-1.06H3a2 2 0 1 1 0-4h.02A1.8 1.8 0 0 0 4.65 8.2a1.8 1.8 0 0 0-.36-1.98l-.02-.02a2 2 0 1 1 2.83-2.83l.02.02A1.8 1.8 0 0 0 9.1 3.04H9a2 2 0 1 1 4 0v.02a1.8 1.8 0 0 0 1.06 1.65 1.8 1.8 0 0 0 1.98-.36l.02-.02a2 2 0 1 1 2.83 2.83l-.02.02a1.8 1.8 0 0 0-.36 1.98c.2.62.62 1.15 1.24 1.35H21a2 2 0 1 1 0 4h-.02c-.63.2-1.15.62-1.35 1.24Z"/>
        </svg>
      );
    default:
      return <span className={cls}>•</span>;
  }
}

/** ===== Helpers para el bloque inferior (dinámicos) ===== **/
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-NI", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function getServerHost() {
  try {
    if (API_URL) {
      const u = new URL(API_URL);
      return u.host || u.hostname || "—"; // ej: 127.0.0.1:5567
    }
  } catch {}
  return typeof window !== "undefined" ? window.location.host : "—";
}

export default function Sidebar() {
  const pathname = usePathname();

  // Último acceso + host del servidor
  const [lastAccess, setLastAccess] = useState("");
  const serverHost = useMemo(() => getServerHost(), []);

  useEffect(() => {
    const KEY = "lastAccessAt";
    try {
      const prev = localStorage.getItem(KEY);
      if (prev) setLastAccess(prev);
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
  }, []);

  return (
    <aside className="hidden md:flex w-72 bg-white shadow-sm">
      <div className="p-6 flex-1 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo1.png" className="h-12 w-auto" alt="BANCO LAFISE" />
        </div>

        {/* Menú */}
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
                  <Icon name={id} active={active} />
                  {label}
                </span>
                <span className={active ? "text-emerald-600" : "text-gray-400"}>
                  ▸
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Tasa de cambio + IP/Último acceso */}
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
            <div>
              IP del Servidor:{" "}
              <span className="font-medium text-gray-700">{serverHost}</span>
            </div>
            <div>
              Último acceso:{" "}
              <span className="font-medium text-gray-700">
                {formatDateTime(lastAccess)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
