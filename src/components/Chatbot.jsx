import { useEffect, useRef, useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 💖 I’m here for you. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    console.log("Sending message:", input);

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://hearttalk1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      console.log("Bot reply received:", data);

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: data.reply || "No reply 😶" }
      ]);
    } catch (err) {
      console.error("Error fetching bot reply:", err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Connection error 😢" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #fce4f8, #fef6fb)", fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: 20, textAlign: "center", fontWeight: 600, fontSize: 22, color: "#6b21a8", background: "#f8e8f4", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        💗 HeartTalk Chat
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            background: msg.sender === "user" ? "#e0c3fc" : "#f8d3f5",
            color: "#6b21a8",
            padding: "12px 18px",
            borderRadius: 25,
            maxWidth: "70%",
            wordBreak: "break-word",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: "#6b21a8", fontStyle: "italic" }}>💬 Bot is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", padding: 15, gap: 10, background: "#f2d7f5", borderTop: "1px solid #e0c3fc" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "12px 15px", borderRadius: 25, border: "1px solid #e0c3fc", outline: "none", fontSize: 15 }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: "12px 20px", borderRadius: 25, background: "#d03d7cff", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
