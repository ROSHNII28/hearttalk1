import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch"; // ya Node 18+ me native fetch

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hearttalk2.netlify.app",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.json({ reply: "Please say something!" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEN_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ text: userMessage }] }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gen API returned error:", errText);
      return res.status(500).json({ reply: "AI service error 😔" });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.[0]?.text || "I'm here for you 💙";

    res.json({ reply });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ reply: "Something went wrong 😔" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
