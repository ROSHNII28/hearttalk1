// src/components/MoodCalendar.jsx
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

const moods = [
  { label: "Happy", color: "#FFD93D" },
  { label: "Sad", color: "#4A90E2" },
  { label: "Neutral", color: "#AAAAAA" },
  { label: "Angry", color: "#FF6B6B" },
  { label: "Excited", color: "#FF8C42" },
  { label: "Anxious", color: "#9B59B6" },
];

function MoodCalendar() {
  const today = new Date();

  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [moodMap, setMoodMap] = useState({});
  const [displayedMonth, setDisplayedMonth] = useState(today.getMonth());
  const [displayedYear, setDisplayedYear] = useState(today.getFullYear());

  // Wait for user to be logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(displayedYear, displayedMonth, 1).getDay();

  const formatDateKey = (day) => {
    const mm = String(displayedMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${displayedYear}-${mm}-${dd}`;
  };

  const fetchMood = async (dateKey) => {
    if (!userId) return;
    const docRef = doc(db, "users", userId, "moods", dateKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMoodMap((prev) => ({
        ...prev,
        [dateKey]: docSnap.data().mood,
      }));
    }
  };

  const handleMoodSelect = async (mood) => {
    if (!selectedDate || !userId) return;

    await setDoc(doc(db, "users", userId, "moods", selectedDate), {
      mood: mood.label,
      timestamp: Date.now(),
    });

    setMoodMap((prev) => ({ ...prev, [selectedDate]: mood.label }));
    setSelectedDate(null);
  };

  const handleClearMood = async () => {
    if (!selectedDate || !userId) return;

    await setDoc(doc(db, "users", userId, "moods", selectedDate), {});
    setMoodMap((prev) => {
      const copy = { ...prev };
      delete copy[selectedDate];
      return copy;
    });
    setSelectedDate(null);
  };

  // Load moods for displayed month
  useEffect(() => {
    if (!userId) return;
    const loadMoods = async () => {
      for (let day = 1; day <= daysInMonth; day++) {
        await fetchMood(formatDateKey(day));
      }
    };
    loadMoods();
  }, [userId, displayedMonth, displayedYear]);

  // Month navigation
  const prevMonth = () => {
    let newMonth = displayedMonth - 1;
    let newYear = displayedYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setDisplayedMonth(newMonth);
    setDisplayedYear(newYear);
  };
  const nextMonth = () => {
    let newMonth = displayedMonth + 1;
    let newYear = displayedYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setDisplayedMonth(newMonth);
    setDisplayedYear(newYear);
  };
  
  return (
    <div className="page-wrapper">
      <div className="calendar-wrapper">
        {/* Month Navigation */}
        <div className="month-nav">
          <button onClick={prevMonth}>◀</button>
          <span>{new Date(displayedYear, displayedMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
          <button onClick={nextMonth}>▶</button>
        </div>


        {/* Weekdays */}
        <div className="weekdays">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="weekday">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="days-grid">
          {[...Array(firstDayWeekday)].map((_, i) => <div key={"empty-" + i} className="day empty"></div>)}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateKey = formatDateKey(day);
            const mood = moodMap[dateKey];
            const moodColor = moods.find((m) => m.label === mood)?.color || "transparent";

            return (
              <div
                key={dateKey}
                className={`day${selectedDate === dateKey ? " selected" : ""}`}
                style={{ backgroundColor: moodColor + "40" }}
                onClick={() => setSelectedDate(dateKey)}
                title={mood || "No mood set"}
              >
                <div className="day-number">{day}</div>
                {mood && <div className="mood-dot" style={{ backgroundColor: moodColor }} />}
              </div>
            );
          })}
        </div>

        {/* Mood Selector */}
        {selectedDate && (
          <div className="mood-selector-backdrop" onClick={() => setSelectedDate(null)}>
            <div className="mood-selector" onClick={(e) => e.stopPropagation()}>
              <h3>Select your mood for <span className="date-highlight">{selectedDate}</span></h3>
              <div className="mood-options">
                {moods.map((m) => (
                  <button key={m.label} style={{ backgroundColor: m.color }} onClick={() => handleMoodSelect(m)}>
                    {m.label}
                  </button>
                ))}
                <button className="clear-btn" onClick={handleClearMood}>Clear</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        html, body { margin:0; padding:0; font-family:'Poppins', sans-serif; }
        .page-wrapper { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#ffe8f2; padding:20px; }
        .calendar-wrapper { background:#fff0f6; padding:30px 40px; border-radius:30px; width:450px; max-width:95%; text-align:center; }
        .month-nav { display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; font-weight:700; }
        .month-nav button { padding:5px 10px; cursor:pointer; border:none; border-radius:8px; background:#d3a0e0; color:white; }
        .weekdays { display:grid; grid-template-columns:repeat(7,1fr); font-weight:600; color:#a979c3; margin-bottom:10px; }
        .weekday { text-align:center; }
        .days-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:10px; }
        .day { background:white; border-radius:16px; height:70px; display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer; }
        .day.empty { background:transparent; cursor:default; }
        .day.selected { box-shadow:0 0 15px #6a3ea1; transform:scale(1.05); z-index:10; transition:transform 0.2s; }
        .day-number { font-weight:700; color:#6a3ea1; }
        .mood-dot { position:absolute; bottom:8px; right:8px; width:16px; height:16px; border-radius:50%; border:2.5px solid white; }
        .mood-selector-backdrop { position:fixed; inset:0; background:rgba(106,62,161,0.15); display:flex; justify-content:center; align-items:center; }
        .mood-selector { background:white; border-radius:24px; padding:25px; box-shadow:0 8px 25px rgba(106,62,161,0.3); text-align:center; }
        .mood-selector h3 { margin-bottom:20px; color:#6a3ea1; }
        .date-highlight { background:linear-gradient(90deg,#ffb7c5,#ff9fb0); padding:3px 10px; border-radius:14px; color:white; }
        .mood-options { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }
        .mood-options button { border:none; color:white; font-weight:700; padding:10px 15px; border-radius:22px; cursor:pointer; flex:1 1 90px; }
        .clear-btn { background:#ccc; color:#555; flex:1 1 100%; margin-top:10px; }
      `}</style>
    </div>
  );
}

export default MoodCalendar;
