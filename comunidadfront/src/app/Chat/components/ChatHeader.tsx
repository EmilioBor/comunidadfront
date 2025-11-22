import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChatHeader({ title }: { title: string }) {
  return (
    <header className="bg-[#47C7C1] rounded-t-3xl text-white px-6 py-4 flex items-center gap-3 shadow">
      <Link href="/Chat">
        <ArrowLeft className="text-white cursor-pointer" />
      </Link>
      <h1 className="font-semibold text-lg">{title}</h1>
      <p>Nombre</p>
      <p>Imagen</p>
    </header>
  );
}
