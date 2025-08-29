"use client";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="flex items-center gap-3 px-3 py-2">
        <button
          aria-label="Abrir menú"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>


        
        <div className="flex items-center gap-2">
          <span className="font-semibold"></span>
        </div>

        {/* Acciones derecha (placeholders: campana, buscador, usuario) */}
        <div className="ml-auto flex items-center gap-2">

          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Buscar..."
              className="h-9 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="h-9 w-9 overflow-hidden rounded-full border border-gray-300">
            <img src="/user.png" alt="Perfil" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
