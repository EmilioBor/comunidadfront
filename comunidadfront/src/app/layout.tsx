// app/layout.tsx (Server Component)
import "./globals.css";
import Navbar from "./Inicio/components/Navbar";

export const metadata = {
  title: "Comunidad Solidaria",
  description: "Login",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
