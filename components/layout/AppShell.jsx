"use client";
import { useState } from "react";
import SidebarContainer from "./SidebarContainer";
import Topbar from "./Topbar"; 

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar: móvil, fijo en pc */}
      <SidebarContainer open={open} onClose={() => setOpen(false)} />

      {/* Columna de contenido */}
      <div className="flex min-h-screen flex-col">
        <Topbar onMenuClick={() => setOpen(true)} />

        {/* Contenido */}
        <main className="p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
