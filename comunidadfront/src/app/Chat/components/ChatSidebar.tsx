import Link from "next/link";

export default function ChatSidebar({ chats, selectedChatId }: any) {
  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-300 h-screen p-4 overflow-y-auto hidden md:block">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      {chats.map((chat: any) => (
        <Link key={chat.id} href={`/chat/${chat.id}`}>
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
