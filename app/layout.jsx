import "./globals.css";
import { BankProvider } from "../context/BankContext";
import AppShell from "../components/layout/AppShell";

export const metadata = {
  title: "Prueba técnica",
  description: "Frontend Next + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <BankProvider>
          <AppShell>{children}</AppShell>
        </BankProvider>
      </body>
    </html>
  );
}
