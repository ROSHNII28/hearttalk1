import { useEffect, useRef, useState } from "react";

export default function BreathingExercise() {
  const phases = [
    { text: "Inhale", duration: 4000 },
    { text: "Hold", duration: 7000 },
    { text: "Exhale", duration: 8000 },
  ];

  const [currentPhase, setCurrentPhase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [circleScale, setCircleScale] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    const runPhase = () => {
      const phase = phases[currentPhase];
      // Animate circle
      if (phase.text === "Inhale") setCircleScale(1.5);
      else if (phase.text === "Hold") setCircleScale(1.5);
      else setCircleScale(1);

      intervalRef.current = setTimeout(() => {
        setCurrentPhase((prev) => (prev + 1) % phases.length);
      }, phase.duration);
    };

    runPhase();
    return () => clearTimeout(intervalRef.current);
  }, [currentPhase, isRunning]);

  const toggleStart = () => {
    if (isRunning) {
      setIsRunning(false);
      clearTimeout(intervalRef.current);
      setCircleScale(1);
    } else {
      setIsRunning(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFF7FA, #F5EBFF)",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Floating emojis */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          fontSize: "2rem",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        ✨
      </div>
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "20%",
          fontSize: "2rem",
          animation: "float 4s ease-in-out infinite",
          animationDelay: "1s",
        }}
      >
        🌸
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "25%",
          fontSize: "2rem",
          animation: "float 3.5s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      >
        🌟
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: "#6A3EA1",
          marginBottom: "50px",
          zIndex: 10,
        }}
      >
        Breathing Exercise
      </h1>

      {/* Breathing Circle */}
      <div
        style={{
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FFB7C5, #B8B4E3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "2rem",
          fontWeight: "700",
          transform: `scale(${circleScale})`,
          transition: "transform 3s ease-in-out",
          boxShadow: "0 10px 40px rgba(184,180,227,0.3)",
          zIndex: 10,
        }}
      >
        {phases[currentPhase].text}
      </div>

      {/* Start/Stop Button */}
      <button
        onClick={toggleStart}
        style={{
          marginTop: "50px",
          padding: "15px 40px",
          borderRadius: "30px",
          border: "none",
          background: isRunning
            ? "linear-gradient(135deg, #ACE7FF, #6A3EA1)"
            : "linear-gradient(135deg, #FFB7C5, #B8B4E3)",
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(184,180,227,0.3)",
          transition: "all 0.3s ease",
        }}
      >
        {isRunning ? "Stop" : "Start"}
      </button>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
