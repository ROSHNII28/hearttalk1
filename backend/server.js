import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEN_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "system", parts: [{ text: "You are HeartBot, a kind and caring chatbot." }] },
            { role: "user", parts: [{ text: userMessage }] }
          ]
        }),
      }
    );

    const data = await response.json();
    res.json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here for you ❤️" });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Something went wrong 💔" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
