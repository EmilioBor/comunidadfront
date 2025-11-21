export default function ChatMessages({ messages, bottomRef }: any) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
      {messages.map((m: any) => (
        <div
          key={m.id}
          className={`flex ${m.soyYo ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`px-4 py-2 max-w-xs rounded-2xl shadow 
              ${m.soyYo
                ? "bg-[#47C7C1] text-white rounded-br-sm"
                : "bg-white text-black rounded-bl-sm"}`}
          >
            <p>{m.contenido}</p>
            <p>{m.perfilIdPerfil}</p>
            <p className="text-[10px] opacity-80 text-right mt-1">
              {new Date(m.fechaHora).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
