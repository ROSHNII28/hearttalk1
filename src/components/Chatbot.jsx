import { useRef, useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi ! 💗 I’m here for you. What’s on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const canvasRef = useRef(null);

  const API_KEY = "AIzaSyD4xzFUm1RWcabRClibnAMTreIn1f3s19g";

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");

    setMessages(prev => [...prev, { sender: "bot", text: "Thinking..." }]);

    const reply = await getGeminiResponse(userMessage);

    setMessages(prev => {
      const filtered = prev.filter(m => m.text !== "Thinking...");
      return [...filtered, { sender: "bot", text: reply }];
    });
  };

  // 💗 EMOTIONAL AI FUNCTION — FIXED FOR GEMINI 2.5 FLASH
  async function getGeminiResponse(prompt) {
    const emotionalSystemPrompt = `
You are an emotional-support chatbot named HeartTalk.
Your tone is warm, gentle, soft and caring.
You never give technical, factual, or logical explanations.
You ONLY focus on emotions, comfort, validation, empathy, and encouragement.
You speak like a loving, supportive friend who truly listens.
If the user asks for anything non-emotional, gently bring the conversation back to feelings.
Always respond with kindness, empathy, and soft emotional support.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: emotionalSystemPrompt + "\nUser: " + prompt
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I’m here with you ❤️ Tell me what you're feeling."
      );
    } catch (err) {
      console.error(err);
      return "Something went wrong 💗 but I'm right here with you.";
    }
  }

  return (
    <div className="chat-main">
      <header className="chat-header">
        <h2> 💗 HeartTalk AI</h2>
      </header>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <footer className="chat-footer">
        <textarea
          placeholder="Share your thoughts..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), sendMessage())}
        />
        <button onClick={sendMessage}>Send 💬</button>
      </footer>

      <style>{`
        .chat-main {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #fde7f3, #fff);
          font-family: 'Poppins', sans-serif;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px;
          background: #ffffffcc;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #f2c6df;
        }

        .chat-box {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .msg {
          max-width: 75%;
          padding: 12px 18px;
          border-radius: 20px;
          font-size: 0.95rem;
          line-height: 1.4;
          animation: fadeIn .3s ease;
        }

        .msg.user {
          align-self: flex-end;
          background: #ffd1e8;
          color: #6b2f50;
          border-bottom-right-radius: 8px;
        }

        .msg.bot {
          align-self: flex-start;
          background: #e1d0ff;
          color: #4b2ba8;
          border-bottom-left-radius: 8px;
        }

        .chat-footer {
          display: flex;
          gap: 10px;
          padding: 15px;
          background: #ffffffee;
          border-top: 1px solid #f2c6df;
        }

        textarea {
          flex: 1;
          resize: none;
          border-radius: 15px;
          padding: 12px 16px;
          border: 1px solid #dfb1cc;
          background: #fff;
          font-size: 1rem;
          outline: none;
        }

        textarea:focus {
          border-color: #ef5da8;
          box-shadow: 0 0 5px rgba(255, 105, 180, 0.4);
        }

        button {
          padding: 0 20px;
          border: none;
          border-radius: 15px;
          background: linear-gradient(90deg, #ff8fb1, #ef5da8);
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        button:hover {
          opacity: 0.9;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
