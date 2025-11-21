import Link from "next/link";

export default function ChatSidebar({ chats, selectedChatId }: any) {
  return (
    <aside className="w-72 bg-[#E2F0D9] p-4 hidden md:flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-black">Lista de Chats</h2>

      {chats.map((chat: any) => (
        <Link key={chat.id} href={`/Chat/${chat.id}`}>
          <div
            className={`p-3 rounded-lg mb-2 cursor-pointer ${
              selectedChatId === chat.id ? "bg-blue-200" : "bg-white"
            }`}
          >
            <p className="font-medium text-gray-800">{chat.nombre}</p>
          </div>
        </Link>
      ))}
    </aside>
  );
}
