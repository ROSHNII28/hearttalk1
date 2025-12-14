import { useMemo } from "react";

// Affirmations List
const affirmationsData = [
  { text: "Everything will get done!", icon: "⏰" },
  { text: "My friends like me for who I am", icon: "🐦" },
  { text: "I have a great butt", icon: "🍑" },
  { text: "I am funny", icon: "😄" },
  { text: "I am intelligent", icon: "💡" },
  { text: "I have time to do things I love", icon: "🏠" },
  { text: "I am grateful for my house", icon: "🏡" },
  { text: "I'm not perfect and that's okay", icon: "💖" },
  { text: "I am allowed to be LOUD", icon: "📢" },
  { text: "My feelings matter", icon: "🌈" },
  { text: "I deserve and receive massive amounts of love every day", icon: "❤️" },
  { text: "My thoughts matter", icon: "🧠" },
  { text: "I like me, I love me", icon: "💕" },
  { text: "I love my body", icon: "🌸" },
  { text: "I am allowed to take up space", icon: "⭐" },
  { text: "I am beautiful", icon: "👁️" },
];

// Random rotation helper
const getRandomRotation = () => `${Math.random() * 16 - 8}deg`;

// Pastel background palette
const pastelColors = ["#F4C6B8", "#F8E1CF", "#F7C8B8", "#F6B89D", "#F3D1BF", "#F8EDEB"];

export default function PlayfulAffirmations() {
  // Generate rotations once
  const rotations = useMemo(
    () => affirmationsData.map(() => getRandomRotation()),
    []
  );

  return (
    <>
      {/* 👇 Embedded Styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Shadows+Into+Light&display=swap');

        body {
          background: #FFF1E8;
          font-family: 'Patrick Hand', cursive;
          padding: 2rem;
          margin: 0;
          display: flex;
          justify-content: center;
        }

        h1 {
          font-family: 'Shadows Into Light', cursive;
          font-size: 3.5rem;
          margin-bottom: 2rem;
          color: #A76B54;
          text-align: center;
        }

        .container {
          max-width: 900px;
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          justify-content: center;
        }

        .card {
          border-radius: 1.2rem;
          padding: 1rem 1.5rem;
          max-width: 250px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: default;
          border: 2px dashed;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 2px 2px 8px rgba(167, 107, 84, 0.3);
        }

        .card:hover {
          transform: scale(1.07);
          box-shadow: 4px 4px 14px rgba(167, 107, 84, 0.5);
        }

        .emoji {
          font-size: 2rem;
        }

        .text {
          color: #A76B54;
          font-size: 1.15rem;
          line-height: 1.3;
        }
      `}</style>

      <main>
        <h1>Daily Affirmations</h1>

        <div className="container">
          {affirmationsData.map((item, index) => (
            <div
              key={index}
              className="card"
              style={{
                backgroundColor: pastelColors[index % pastelColors.length],
                borderColor: pastelColors[index % pastelColors.length],
                transform: `rotate(${rotations[index]})`,
              }}
            >
              <span className="emoji">{item.icon}</span>
              <span className="text">{item.text}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
