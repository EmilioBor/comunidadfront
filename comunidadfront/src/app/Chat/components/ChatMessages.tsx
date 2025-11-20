export default function ChatMessages({ messages, userId }: any) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg: any, i: number) => {
        const isMine = msg.senderId === userId;

        return (
          <div
            key={i}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-xs ${
                isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
