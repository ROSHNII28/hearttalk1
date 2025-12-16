// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();

// ✅ Proper CORS config (Netlify + local dev)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hearttalk28.netlify.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Handle preflight explicitly
app.options("*", cors());

app.use(express.json());

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEN_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here for you 💙";

    res.json({ reply });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ reply: "Something went wrong 😔" });
  }
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
