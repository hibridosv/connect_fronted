import type { Metadata } from "next";
import "../styles/globals.css";
import Providers from "@/providers/providers";

export const metadata: Metadata = {
  title: "Sistema de Inventario y Facturación",
  description: "Sistema creado por Hibrido El Salvador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full bg-bg-base">
      <body className="h-full flex flex-col">
        <Providers>
          <main className="flex-grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
