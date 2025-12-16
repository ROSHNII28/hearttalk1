import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch"; // if using Node 18+, can use global fetch

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hearttalk2.netlify.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEN_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ text: userMessage }],
        }),
      }
    );

    const data = await response.json();

    // Extract reply safely
    const reply =
      data?.candidates?.[0]?.content?.[0]?.text ||
      "I'm here for you 💙"; // default if API fails

    res.json({ reply });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ reply: "Something went wrong 😔" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
