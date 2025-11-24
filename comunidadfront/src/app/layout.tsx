// app/layout.tsx (Server Component)
import "./globals.css";
import Navbar from "./Inicio/components/Navbar";
import { Itim } from 'next/font/google';
const itim = Itim({
  weight: '400',
  subsets: ['latin'],
});
export const metadata = {
  title: "Comunidad Solidaria",
  description: "Login",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={itim.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
