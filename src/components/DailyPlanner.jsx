// src/components/ProductivityHub.jsx
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, ensureAuth } from "../firebase";

export default function ProductivityHub() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>
          <span style={styles.titleAccent}>Productivity</span> HUB ✨
        </h1>
        <p style={styles.subtitle}>Your all-in-one planning companion</p>
      </div>

      {/* HOME — 3 CARDS */}
      {activeTab === "home" && (
        <div style={styles.homeGrid}>
          <div style={styles.card} onClick={() => setActiveTab("planner")}>
            <div style={styles.cardIcon}>📅</div>
            <h2 style={styles.cardTitle}>Daily Planner</h2>
            <p style={styles.cardDesc}>Organize your day with to-do lists and reminders</p>
          </div>

          <div style={styles.card} onClick={() => setActiveTab("manifest")}>
            <div style={styles.cardIcon}>🎯</div>
            <h2 style={styles.cardTitle}>Manifest Goals</h2>
            <p style={styles.cardDesc}>Set intentions and create actionable steps</p>
          </div>

          <div style={styles.card} onClick={() => setActiveTab("selfcare")}>
            <div style={styles.cardIcon}>💖</div>
            <h2 style={styles.cardTitle}>Self-Care</h2>
            <p style={styles.cardDesc}>Track wellness habits and daily routines</p>
          </div>
        </div>
      )}

      {/* PLANNER */}
      {activeTab === "planner" && (
        <div style={styles.pageContent}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={styles.backBtn} onClick={() => setActiveTab("home")}>
              ← Back to Hub
            </button>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={styles.ghostBtn} onClick={() => setActiveTab("manifest")}>
                Go to Manifest
              </button>
              <button style={styles.ghostBtn} onClick={() => setActiveTab("selfcare")}>
                Go to Self-Care
              </button>
            </div>
          </div>
          <DailyPlanner />
        </div>
      )}

      {/* MANIFEST */}
      {activeTab === "manifest" && (
        <div style={styles.pageContent}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={styles.backBtn} onClick={() => setActiveTab("home")}>
              ← Back to Hub
            </button>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={styles.ghostBtn} onClick={() => setActiveTab("planner")}>
                Go to Planner
              </button>
              <button style={styles.ghostBtn} onClick={() => setActiveTab("selfcare")}>
                Go to Self-Care
              </button>
            </div>
          </div>
          <Manifest />
        </div>
      )}

      {/* SELF-CARE */}
      {activeTab === "selfcare" && (
        <div style={styles.pageContent}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={styles.backBtn} onClick={() => setActiveTab("home")}>
              ← Back to Hub
            </button>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={styles.ghostBtn} onClick={() => setActiveTab("planner")}>
                Go to Planner
              </button>
              <button style={styles.ghostBtn} onClick={() => setActiveTab("manifest")}>
                Go to Manifest
              </button>
            </div>
          </div>
          <SelfCare />
        </div>
      )}
    </div>
  );
}

/* ==================== DAILY PLANNER ==================== */
function DailyPlanner() {
  const todayKey = new Date().toISOString().split("T")[0];
  const [dateKey, setDateKey] = useState(todayKey);
  const [todo, setTodo] = useState(Array(10).fill(""));
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  async function loadPlanner() {
    setLoading(true);
    try {
      await ensureAuth();
      const u = auth.currentUser;
      const dRef = doc(db, "users", u.uid, "plannerEntries", dateKey);
      const snap = await getDoc(dRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.todo && Array.isArray(data.todo)) setTodo(data.todo);
      } else {
        // reset if no entry for date
        setTodo(Array(10).fill(""));
      }
    } catch (err) {
      console.error("Load planner error", err);
      alert("Could not load planner: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function savePlanner() {
    try {
      await ensureAuth();
      const u = auth.currentUser;
      const dRef = doc(db, "users", u.uid, "plannerEntries", dateKey);
      await setDoc(dRef, {
        todo,
        date: dateKey,
        updatedAt: new Date().toISOString(),
      });
      alert("Planner saved ✅");
    } catch (err) {
      console.error("Save planner error", err);
      alert("Save failed: " + err.message);
    }
  }

  return (
    <div style={plannerStyles.wrapper}>
      <div style={plannerStyles.header}>
        <h2 style={plannerStyles.title}>
          <span style={plannerStyles.titleScript}>Daily</span> PLANNER
        </h2>

        <div style={plannerStyles.daysRow}>
          {["M", "T", "W", "T", "H", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        <div style={plannerStyles.dateRow}>
          <label style={plannerStyles.dateLabel}>DATE:</label>
          <input
            style={plannerStyles.dateInput}
            type="date"
            value={dateKey}
            onChange={(e) => setDateKey(e.target.value)}
          />
        </div>
      </div>

      <div style={plannerStyles.mainContent}>
        <div style={plannerStyles.todoBox}>
          <h3 style={plannerStyles.todoTitle}>TO DO LIST</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul style={plannerStyles.todoList}>
              {todo.map((item, i) => (
                <li key={i} style={plannerStyles.todoItem}>
                  <input
                    style={{ width: "100%", border: "none", background: "transparent" }}
                    value={todo[i]}
                    placeholder={`Task ${i + 1}`}
                    onChange={(e) => {
                      const updated = [...todo];
                      updated[i] = e.target.value;
                      setTodo(updated);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button onClick={savePlanner} style={styles.backBtn}>
              Save Planner
            </button>

            <button
              onClick={() => setShowHistory(true)}
              style={styles.ghostBtn}
            >
              View History
            </button>
          </div>

          {/* History modal */}
          {showHistory && (
            <HistoryModal
              collectionName="plannerEntries"
              onSelectDate={(d) => {
                setDateKey(d);
                setShowHistory(false);
              }}
              onClose={() => setShowHistory(false)}
            />
          )}
        </div>

        <div style={plannerStyles.rightColumn}>
          <div style={plannerStyles.sectionBox}>
            <h3>FOCUS</h3>
            <p></p>
          </div>
          <div style={plannerStyles.sectionBox}>
            <h3>REMINDER</h3>
            <p></p>
          </div>
          <div style={plannerStyles.sectionBox}>
            <h3>NOTES</h3>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== MANIFEST ==================== */
function Manifest() {
  const todayKey = new Date().toISOString().split("T")[0];
  const [dateKey, setDateKey] = useState(todayKey); // make date selectable
  const [showHistory, setShowHistory] = useState(false);

  const [form, setForm] = useState({
    want: "",
    feeling: "",
    now: "",
    firstStep: "",
    helpPeople: "",
    nextSteps: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadManifest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  async function loadManifest() {
    setLoading(true);
    try {
      await ensureAuth();
      const u = auth.currentUser;
      const dRef = doc(db, "users", u.uid, "manifestEntries", dateKey);
      const snap = await getDoc(dRef);
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          want: data.want || "",
          feeling: data.feeling || "",
          now: data.now || "",
          firstStep: data.firstStep || "",
          helpPeople: data.helpPeople || "",
          nextSteps: data.nextSteps || "",
        });
      } else {
        setForm({
          want: "",
          feeling: "",
          now: "",
          firstStep: "",
          helpPeople: "",
          nextSteps: "",
        });
      }
    } catch (err) {
      console.error("Load manifest error", err);
      alert("Could not load manifest: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveManifest() {
    try {
      await ensureAuth();
      const u = auth.currentUser;
      const dRef = doc(db, "users", u.uid, "manifestEntries", dateKey);
      await setDoc(dRef, { ...form, date: dateKey, updatedAt: new Date().toISOString() });
      alert("Manifest saved ✨");
    } catch (err) {
      console.error("Save manifest error", err);
      alert("Save failed: " + err.message);
    }
  }

  return (
    <div style={manifestStyles.page}>
      <h1 style={manifestStyles.title}>Manifest Your Goals</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <label style={manifestStyles.label}>DATE</label>{" "}
          <input type="date" value={dateKey} onChange={(e) => setDateKey(e.target.value)} style={plannerStyles.dateInput} />
        </div>

        <div>
          <button onClick={() => setShowHistory(true)} style={styles.ghostBtn}>
            View History
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      <div style={manifestStyles.row}>
        <div style={manifestStyles.box}>
          <label style={manifestStyles.label}>I WANT ...</label>
          <textarea
            style={manifestStyles.textarea}
            value={form.want}
            onChange={(e) => setForm({ ...form, want: e.target.value })}
          />
        </div>
        <div style={manifestStyles.box}>
          <label style={manifestStyles.label}>WHEN I GET THERE I WILL FEEL ...</label>
          <textarea
            style={manifestStyles.textarea}
            value={form.feeling}
            onChange={(e) => setForm({ ...form, feeling: e.target.value })}
          />
        </div>
      </div>

      <div style={manifestStyles.row}>
        <div style={manifestStyles.box}>
          <label style={manifestStyles.label}>Where are you now?</label>
          <textarea
            style={manifestStyles.textarea}
            value={form.now}
            onChange={(e) => setForm({ ...form, now: e.target.value })}
          />
        </div>
        <div style={manifestStyles.box}>
          <label style={manifestStyles.label}>THE FIRST THING I NEED TO DO IS ...</label>
          <textarea
            style={manifestStyles.textarea}
            value={form.firstStep}
            onChange={(e) => setForm({ ...form, firstStep: e.target.value })}
          />
        </div>
      </div>

      <div style={manifestStyles.row}>
        <div style={manifestStyles.box}>
          <label style={manifestStyles.label}>PEOPLE I CAN ASK FOR HELP INCLUDE ...</label>
          <textarea
            style={manifestStyles.textarea}
            value={form.helpPeople}
            onChange={(e) => setForm({ ...form, helpPeople: e.target.value })}
          />
        </div>
        <div style={manifestStyles.boxLarge}>
          <label style={manifestStyles.label}>What are your next steps?</label>
          <textarea
            style={manifestStyles.textareaLarge}
            value={form.nextSteps}
            onChange={(e) => setForm({ ...form, nextSteps: e.target.value })}
          />
        </div>
      </div>

      <div style={manifestStyles.tipBox}>
        <p>
          ⭐ <b>TOP TIP:</b> MAKE YOUR STEPS SMALL FOR EASIER CLIMBING <br />
          Break down what you need to do as much as possible.
        </p>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={saveManifest} style={styles.backBtn}>
          Save Manifest
        </button>
      </div>

      {/* History modal */}
      {showHistory && (
        <HistoryModal
          collectionName="manifestEntries"
          onSelectDate={(d) => {
            setDateKey(d);
            setShowHistory(false);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

/* ==================== SELF-CARE ==================== */
function SelfCare() {
  const todayKey = new Date().toISOString().split("T")[0];
  const checklistItems = [
    "Make your bed",
    "Take your medications & vitamins",
    "Morning skincare routine",
    "Breakfast",
    "15–30 min workout or walk",
    "Clean house (light clean)",
  ];

  const [dateKey, setDateKey] = useState(todayKey);
  const [checked, setChecked] = useState({});
  const [mood, setMood] = useState("");
  const [water, setWater] = useState(0);
  const [happyText, setHappyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadSelfCare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  async function loadSelfCare() {
    setLoading(true);
    try {
      await ensureAuth();
      const u = auth.currentUser;
      const dRef = doc(db, "users", u.uid, "selfcareEntries", dateKey);
      const snap = await getDoc(dRef);
      if (snap.exists()) {
        const data = snap.data();
        setChecked(data.checked || {});
        setMood(data.mood || "");
        setWater(data.water || 0);
        setHappyText(data.happyText || "");
      } else {
        // reset
        setChecked({});
        setMood("");
        setWater(0);
        setHappyText("");
      }
    } catch (err) {
      console.error("Load selfcare error", err);
      alert("Could not load self-care: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveSelfCare() {
    try {
      await ensureAuth();
      const u = auth.currentUser;
      const dRef = doc(db, "users", u.uid, "selfcareEntries", dateKey);
      await setDoc(dRef, { checked, mood, water, happyText, date: dateKey, updatedAt: new Date().toISOString() });
      alert("Self-care saved 💖");
    } catch (err) {
      console.error("Save selfcare error", err);
      alert("Save failed: " + err.message);
    }
  }

  return (
    <div style={selfcareStyles.page}>
      <h2 style={selfcareStyles.title}>
        ( Daily )
        <br />
        SELF–CARE
      </h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <label style={selfcareStyles.label}>DATE</label>{" "}
          <input type="date" style={selfcareStyles.dateInput} value={dateKey} onChange={(e) => setDateKey(e.target.value)} />
        </div>

        <div>
          <button onClick={() => setShowHistory(true)} style={styles.ghostBtn}>
            View History
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      <h3 style={selfcareStyles.sectionTitle}>CHECKLIST</h3>

      <div style={selfcareStyles.checklistGrid}>
        {checklistItems.map((item, i) => (
          <label key={i} style={selfcareStyles.checkboxItem}>
            <input
              type="checkbox"
              checked={!!checked[item]}
              onChange={(e) => setChecked({ ...checked, [item]: e.target.checked })}
            />{" "}
            {item}
          </label>
        ))}
      </div>

      <h3 style={selfcareStyles.subHeading}>MOOD</h3>
      <div style={selfcareStyles.moodRow}>
        {["😡", "😕", "😐", "🙂", "😄"].map((m, i) => (
          <label key={i} style={selfcareStyles.moodItem}>
            <span style={{ fontSize: 28 }}>{m}</span>
            <br />
            <input type="radio" name="mood" checked={mood === m} onChange={() => setMood(m)} />
          </label>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Water glasses (0-8)</label>
        <input type="range" min="0" max="8" value={water} onChange={(e) => setWater(Number(e.target.value))} /> {water}
      </div>

      <div style={selfcareStyles.happyBox}>
        <p style={selfcareStyles.happyTitle}>THINGS THAT MAKE ME HAPPY TODAY</p>
        <textarea style={selfcareStyles.textarea} value={happyText} onChange={(e) => setHappyText(e.target.value)} placeholder="Write something..." />
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button onClick={saveSelfCare} style={styles.backBtn}>
          Save Self-Care
        </button>
      </div>

      {/* History modal */}
      {showHistory && (
        <HistoryModal
          collectionName="selfcareEntries"
          onSelectDate={(d) => {
            setDateKey(d);
            setShowHistory(false);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

/* ==================== HISTORY MODAL (IN-FILE) ==================== */
function HistoryModal({ collectionName, onSelectDate, onClose }) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDates() {
    setLoading(true);
    try {
      await ensureAuth();
      const u = auth.currentUser;
      const colRef = collection(db, "users", u.uid, collectionName);
      const snap = await getDocs(colRef);

      const list = [];
      snap.forEach((d) => {
        // prefer doc id if it's a date; otherwise fallback to updatedAt
        const id = d.id;
        const data = d.data();
        list.push({ id, updatedAt: data?.updatedAt || null });
      });

      // sort newest → oldest:
      list.sort((a, b) => {
        // if both have updatedAt, compare them; otherwise compare id strings (dates)
        if (a.updatedAt && b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1;
        return a.id < b.id ? 1 : -1;
      });

      setDates(list.map((x) => x.id));
    } catch (err) {
      console.error("Failed to load history:", err);
      alert("Failed to load history: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // modal overlay click should close only when clicking overlay (not content)
  function overlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div onClick={overlayClick} style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.modalHeader}>
          <h3 style={{ margin: 0 }}>Past Entries</h3>
          <button onClick={onClose} style={modalStyles.closeBtn}>
            ✕
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {loading ? (
            <p>Loading...</p>
          ) : dates.length === 0 ? (
            <p>No past entries found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {dates.map((d) => (
                <li
                  key={d}
                  onClick={() => onSelectDate(d)}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>📅 {d}</strong>
                    <div style={{ fontSize: 12, color: "#666" }}>{/* extra info possible */}</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#7d5ba6" }}>Load</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button onClick={onClose} style={{ ...styles.backBtn, background: "#bbb" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== STYLES (same visual language as your original) ==================== */

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffeef8 0%, #e8d5f2 100%)",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
  },
  mainTitle: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#9b59b6",
    marginBottom: "10px",
  },
  titleAccent: {
    color: "#cc4fafff",
  },
  subtitle: {
    fontSize: "18px",
    color: "#7d5ba6",
  },
  homeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 20px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    boxShadow: "0 5px 20px rgba(155, 89, 182, 0.15)",
  },
  cardIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#9b59b6",
    marginBottom: "10px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#7d5ba6",
  },
  pageContent: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  backBtn: {
    background: "#e91e63",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(233, 30, 99, 0.25)",
  },
  ghostBtn: {
    background: "transparent",
    color: "#7d5ba6",
    border: "1px solid #e7d7ea",
    padding: "8px 12px",
    borderRadius: "12px",
    cursor: "pointer",
  },
};

const plannerStyles = {
  wrapper: {
    background: "#fff7fa",
    borderRadius: "20px",
    border: "4px solid #ca6da08a",
    padding: "20px",
  },
  header: { textAlign: "center" },
  title: { fontSize: "32px", fontWeight: "700", color: "#d26a8a" },
  titleScript: { fontFamily: "Brush Script MT, cursive", color: "#ffb7c5", fontSize: "36px" },
  daysRow: { display: "flex", justifyContent: "center", gap: "15px", fontWeight: "600", marginTop: "15px" },
  dateRow: { textAlign: "right", marginTop: "10px" },
  dateLabel: { marginRight: "5px" },
  dateInput: { border: "none", borderBottom: "2px solid #d7a9e3", background: "transparent", width: "150px", fontSize: "16px", outline: "none" },
  mainContent: { display: "flex", marginTop: "25px", gap: "20px" },
  todoBox: { width: "45%", background: "#ffe4ef", borderRadius: "15px", padding: "20px" },
  todoTitle: { textAlign: "center", marginBottom: "10px" },
  todoList: { padding: 0, listStyle: "none" },
  todoItem: { borderBottom: "1px dashed #777", padding: "6px 0" },
  rightColumn: { width: "55%", display: "flex", flexDirection: "column", gap: "20px" },
  sectionBox: { background: "#f9dbe8", height: "150px", borderRadius: "15px", padding: "15px" },
};

const manifestStyles = {
  page: { background: "#FFF5FA", padding: "25px", borderRadius: "25px", boxShadow: "0 0 20px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#C24BA7", fontSize: "36px", marginBottom: "25px" },
  row: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
  box: { flex: 1, background: "#E8C8EB", padding: "15px", borderRadius: "15px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  boxLarge: { flex: 1, background: "#F7D1E4", padding: "15px", borderRadius: "15px", minHeight: "200px" },
  label: { display: "block", fontWeight: "bold", marginBottom: "8px", color: "#5D2A6A" },
  textarea: { width: "100%", height: "80px", borderRadius: "10px", border: "2px solid #C98BC9", padding: "10px", resize: "vertical", background: "white", outline: "none" },
  textareaLarge: { width: "100%", height: "150px", borderRadius: "10px", border: "2px solid #C98BC9", padding: "10px", resize: "vertical", background: "white", outline: "none" },
  tipBox: { marginTop: "30px", background: "#FCE4F2", padding: "15px", borderRadius: "15px", textAlign: "center", border: "2px dashed #C24BA7", color: "#6A2A6A", fontSize: "14px" },
};

const selfcareStyles = {
  page: { background: "#E4C1C6", padding: "30px", borderRadius: "25px", boxShadow: "0 0 15px rgba(0,0,0,0.1)", color: "#4a3a3a" },
  title: { textAlign: "center", fontSize: "34px", fontWeight: "600", marginBottom: "15px" },
  topRow: { display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" },
  label: { fontSize: "14px", fontWeight: "600" },
  dateInput: { border: "none", borderBottom: "2px solid #7c5a64", background: "transparent", padding: "5px", width: "120px", fontSize: "16px", outline: "none" },
  daysRow: { display: "flex", gap: "12px", fontWeight: "600" },
  sectionTitle: { marginTop: "10px", fontWeight: "600", fontSize: "20px" },
  checklistGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: "10px", gap: "8px 20px" },
  checkboxItem: { display: "flex", alignItems: "center", gap: "10px" },
  subHeading: { marginTop: "25px", marginBottom: "5px", fontWeight: "600" },
  optionsRow: { display: "flex", flexWrap: "wrap", gap: "15px" },
  optionItem: { display: "flex", gap: "8px" },
  sleepRow: { display: "flex", gap: "15px", flexWrap: "wrap" },
  sleepIcon: { textAlign: "center", fontSize: "14px" },
  waterRow: { display: "flex", gap: "15px", flexWrap: "wrap" },
  waterCup: { textAlign: "center", fontSize: "14px" },
  moodRow: { display: "flex", gap: "25px", marginTop: "10px" },
  moodItem: { textAlign: "center", fontSize: "28px" },
  happyBox: { marginTop: "40px", padding: "20px", background: "#d7abb3", borderRadius: "15px" },
  happyTitle: { textAlign: "center", marginBottom: "10px", fontWeight: "600" },
  textarea: { width: "100%", height: "120px", borderRadius: "10px", border: "none", padding: "10px", outline: "none", resize: "vertical" },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 760,
    background: "white",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#888",
  },
};
