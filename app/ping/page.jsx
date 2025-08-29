"use client";
import { useEffect, useState } from "react";

export default function Ping() {
  const [out, setOut] = useState("probando...");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
        setOut(r.ok ? "Mock OK" : `Error: ${r.status}`);
      } catch (e) {
        setOut("No se pudo conectar al mock\n" + e.message);
      }
    })();
  }, []);

  return (
    <div className="p-4 font-mono text-sm bg-gray-100 rounded">
      {out}
    </div>
  );
}
