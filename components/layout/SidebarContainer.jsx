"use client";
import Sidebar from "./Sidebar";

export default function SidebarContainer({ open, onClose }) {
  return (
    <>
      {/* Overlay para telefono */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Contenedor del Sidebar */}
      <aside
        className={[
          "fixed z-50 inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-gray-200",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:w-[260px] lg:max-w-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="h-full overflow-y-auto">
          <Sidebar />
        </div>
      </aside>
    </>
  );
}
