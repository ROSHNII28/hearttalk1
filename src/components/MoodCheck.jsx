import { Heart, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";

const MoodCheck = () => {
  const [start, setStart] = useState(false); // NEW START SCREEN
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [moodResult, setMoodResult] = useState(null);

  // ------ QUESTIONS ------
  const questions = [
    {
      q: "How would you describe your energy level today?",
      options: [
        { text: "Energized and ready to conquer!", value: 5 },
        { text: "Pretty good, feeling positive", value: 4 },
        { text: "Neutral, just getting by", value: 3 },
        { text: "A bit low, struggling", value: 2 },
        { text: "Exhausted and drained", value: 1 },
      ],
    },
    {
      q: "How are you feeling about your goals right now?",
      options: [
        { text: "Motivated and on track!", value: 5 },
        { text: "Optimistic about progress", value: 4 },
        { text: "Uncertain but trying", value: 3 },
        { text: "Discouraged and stuck", value: 2 },
        { text: "Overwhelmed and lost", value: 1 },
      ],
    },
    {
      q: "How would you rate your stress levels?",
      options: [
        { text: "Calm and peaceful", value: 5 },
        { text: "Manageable, doing okay", value: 4 },
        { text: "Moderate stress", value: 3 },
        { text: "High stress, anxious", value: 2 },
        { text: "Extremely stressed out", value: 1 },
      ],
    },
    {
      q: "How connected do you feel to others?",
      options: [
        { text: "Supported and loved", value: 5 },
        { text: "Connected and appreciated", value: 4 },
        { text: "Somewhat isolated", value: 3 },
        { text: "Lonely and disconnected", value: 2 },
        { text: "Very alone", value: 1 },
      ],
    },
    {
      q: "What's your outlook on the future?",
      options: [
        { text: "Excited and hopeful!", value: 5 },
        { text: "Positive and optimistic", value: 4 },
        { text: "Neutral, one day at a time", value: 3 },
        { text: "Worried and uncertain", value: 2 },
        { text: "Pessimistic and fearful", value: 1 },
      ],
    },
  ];

  // ------ MOOD CATEGORIES ------
  const moodCategories = {
    thriving: {
      name: "Thriving",
      color: "#FFB7C5",
      emoji: "🌟",
      quotes: [
        "You're radiating positive energy!",
        "Your momentum is unstoppable.",
        "You're truly in your element today!",
        "Your positive aura lights up everything around you.",
      ],
    },
    positive: {
      name: "Positive",
      color: "#B8B4E3",
      emoji: "😊",
      quotes: [
        "You're doing great!",
        "Your optimism is your power.",
        "Every small step counts.",
        "You're glowing with good energy today.",
      ],
    },
    balanced: {
      name: "Balanced",
      color: "#ACE7FF",
      emoji: "🌊",
      quotes: [
        "A calm day is still a growing day.",
        "You're exactly where you need to be.",
        "Balance brings clarity.",
        "You're doing just fine.",
      ],
    },
    struggling: {
      name: "Struggling",
      color: "#B8B4E3",
      emoji: "💙",
      quotes: [
        "You're stronger than you think.",
        "It's okay to slow down.",
        "Be gentle with yourself.",
        "This moment will pass.",
      ],
    },
    needSupport: {
      name: "Need Support",
      color: "#6A3EA1",
      emoji: "🫂",
      quotes: [
        "You're not alone. Please reach out.",
        "You deserve care and support.",
        "Your feelings matter.",
        "You don't have to carry this alone.",
      ],
    },
  };

  // ------ CALCULATE MOOD ------
  const calculateMood = () => {
    const total = answers.reduce((sum, val) => sum + val, 0);
    const average = total / answers.length;

    let mood;
    if (average >= 4.5) mood = moodCategories.thriving;
    else if (average >= 3.5) mood = moodCategories.positive;
    else if (average >= 2.5) mood = moodCategories.balanced;
    else if (average >= 1.8) mood = moodCategories.struggling;
    else mood = moodCategories.needSupport;

    const randomQuote =
      mood.quotes[Math.floor(Math.random() * mood.quotes.length)];

    setMoodResult({ ...mood, quote: randomQuote });
    setShowResult(true);
  };

  const handleAnswer = (value) => {
    const updated = [...answers, value];
    setAnswers(updated);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateMood();
    }
  };

  const restart = () => {
    setStart(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setMoodResult(null);
  };

  // -----------------------------------------------------
  //  ⭐ PAGE 1 — START SCREEN (NEW)
  // -----------------------------------------------------
  if (!start) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "#FFF6F8" }}
      >
        <div className="text-center max-w-xl mx-auto">
          <div
            className="inline-flex items-center justify-center p-6 rounded-full shadow-md mb-6"
            style={{ background: "#FFB7C5" }}
          >
          </div>

          <h1
            className="text-4xl font-extrabold mb-3"
            style={{ color: "#6A3EA1" }}
          >
            Check Your Mood Today
          </h1>

          <p className="text-lg mb-8" style={{ color: "#B8B4E3" }}>
            Take a quick 5-question test to understand how you're *really*
            feeling 💜
          </p>

          <button
            onClick={() => setStart(true)}
            className="px-8 py-4 rounded-2xl text-white font-semibold shadow-md transition-all hover:scale-[1.05]"
            style={{ background: "#FFB7C5" }}
          >
            Start Mood Test
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // ⭐ PAGE 2 — RESULT SCREEN
  // -----------------------------------------------------
  if (showResult && moodResult) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{ background: "#FFF6F8" }}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div
            className="rounded-[32px] p-10 backdrop-blur-xl shadow-xl border"
            style={{
              background: "rgba(255,255,255,0.6)",
              borderColor: moodResult.color + "60",
            }}
          >
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{moodResult.emoji}</div>
              <h2 className="text-3xl font-bold" style={{ color: "#6A3EA1" }}>
                You’re Feeling: {moodResult.name}
              </h2>
            </div>

            <div
              className="rounded-2xl p-6 mb-6 shadow-inner"
              style={{
                background: moodResult.color + "20",
                borderLeft: `5px solid ${moodResult.color}`,
              }}
            >
              <div className="flex items-start gap-3">
                <Sparkles
                  size={26}
                  style={{ color: moodResult.color }}
                />
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "#6A3EA1" }}
                >
                  {moodResult.quote}
                </p>
              </div>
            </div>

            {moodResult.name === "Need Support" && (
              <div
                className="rounded-xl p-5 mb-6 shadow-sm"
                style={{ background: "#ACE7FF40" }}
              >
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "#6A3EA1" }}
                >
                  You deserve support:
                </p>
                <ul
                  className="text-sm space-y-1"
                  style={{ color: "#6A3EA1" }}
                >
                  <li>• National helpline (988)</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                  <li>• findahelpline.com (global)</li>
                </ul>
              </div>
            )}

            <button
              onClick={restart}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.03]"
              style={{ background: "#FFB7C5" }}
            >
              <RefreshCw size={20} className="inline-block mr-2" />
              Take Again
            </button>

            <p
              className="text-center text-xs mt-5"
              style={{ color: "#999" }}
            >
              This is a quick check-in, not a diagnosis 💜
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // ⭐ PAGE 3 — QUESTION SCREEN
  // -----------------------------------------------------
  return (
    <div
      className="min-h-screen p-6 flex items-center justify-center"
      style={{ background: "#FFF6F8" }}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center p-5 rounded-full shadow-md"
            style={{ background: "#FFB7C5" }}
          >
            <Heart size={45} color="white" />
          </div>

          <h1
            className="text-4xl font-extrabold mt-4"
            style={{ color: "#6A3EA1" }}
          >
            How Are You <span className="italic">Really</span> Feeling?
          </h1>

          <p className="text-lg mt-2" style={{ color: "#B8B4E3" }}>
            Answer 5 short questions for a personalized reflection 🌸
          </p>
        </div>

        <div
          className="rounded-[28px] p-10 shadow-xl backdrop-blur-xl border"
          style={{
            background: "rgba(255,255,255,0.65)",
            borderColor: "#E6DDF5",
          }}
        >
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-2 rounded-full transition-all"
                  style={{
                    background:
                      idx <= currentQuestion
                        ? "#FFB7C5"
                        : "rgba(184,180,227,0.3)",
                  }}
                />
              ))}
            </div>

            <p
              className="text-sm font-medium"
              style={{ color: "#B8B4E3" }}
            >
              Question {currentQuestion + 1} / {questions.length}
            </p>
          </div>

          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: "#6A3EA1" }}
          >
            {questions[currentQuestion].q}
          </h2>

          <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.value)}
                className="py-4 px-6 rounded-2xl text-left shadow-md transition-all"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid #E6DDF5",
                  color: "#6A3EA1",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#FFB7C5";
                  e.currentTarget.style.background = "#FFE9EE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E6DDF5";
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.9)";
                }}
              >
                {option.text}
              </button>
            ))}
          </div>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "#B8B4E3" }}
          >
            Your answers are private 💜
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodCheck;
