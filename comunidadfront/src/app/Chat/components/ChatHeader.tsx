import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChatHeader({ title }: { title: string }) {
  return (
    <header className="w-full bg-white border-b border-gray-300 p-4 flex items-center gap-3">
      <Link href="/chat">
        <ArrowLeft className="text-gray-700 cursor-pointer" />
      </Link>

      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </header>
  );
}
