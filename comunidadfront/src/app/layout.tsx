import "./globals.css";
import { MedievalSharp } from "next/font/google";

const medieval = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Comunidad Solidaria",
  description: "Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={medieval.className}>{children}</body>
    </html>
  );
}
