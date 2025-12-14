import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase"; // adjust path if needed

export default function MoodJournal() {
  const makeEntry = (overrides = {}) => ({
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    anxiousReason: "",
    negativeThoughts: ["", "", ""],
    bodyResponse: ["", "", ""],
    positiveThoughts: ["", "", ""],
    worstOutcome: "",
    controlSteps: ["", "", ""],
    calmBodySteps: ["", "", ""],
    // meta for UI
    summary: "",
    moodEmoji: "🌸", // default emoji for list view — user can change later if desired
    timestamp: Date.now(),
    ...overrides,
  });

  const [entries, setEntries] = useState([]); // array of {firebaseId?, ...entry}
  const [currentEntry, setCurrentEntry] = useState(makeEntry());
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const saveTimer = useRef(null);
  const pendingSaveRef = useRef(null);
  const auth = getAuth();

  // helper: generate a short summary from fields
  const makeSummary = (entry) => {
    const text =
      (entry.anxiousReason || "").trim() ||
      (entry.positiveThoughts?.join(" ").trim() || "") ||
      (entry.negativeThoughts?.join(" ").trim() || "");
    const first = text.split("\n")[0].slice(0, 60);
    return first || "Private entry";
  };

  // --- fetch user's entries when auth ready ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // redirect to login if you wish — for now just clear
        setEntries([]);
        setCurrentEntry(makeEntry());
        setLoading(false);
        return;
      }

      // fetch entries for user
      try {
        setLoading(true);
        const q = query(
          collection(db, "journalEntries"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ firebaseId: d.id, ...d.data() }));
        if (data.length > 0) {
          setEntries(data);
          setCurrentEntry(data[0]);
        } else {
          const first = makeEntry();
          setEntries([first]);
          setCurrentEntry(first);
        }
      } catch (err) {
        console.error("Failed to load entries:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- immediate save function (no debounce) ---
  const saveNow = async (entry) => {
    // cancel pending debounced save
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    // ensure summary and timestamp updated
    const toSave = {
      ...entry,
      summary: makeSummary(entry),
      timestamp: Date.now(),
    };

    try {
      if (toSave.firebaseId) {
        // update existing doc
        const docRef = doc(db, "journalEntries", toSave.firebaseId);
        // avoid saving local-only props like id
        const { id, firebaseId, ...payload } = toSave;
        await updateDoc(docRef, payload);
      } else {
        // create new doc
        const docRef = await addDoc(collection(db, "journalEntries"), {
          userId: auth.currentUser.uid,
          ...toSave,
        });
        toSave.firebaseId = docRef.id;
      }

      // update local state (replace entry)
      setEntries((prev) => {
        const found = prev.find((e) => e.id === toSave.id || e.firebaseId === toSave.firebaseId);
        if (found) {
          return prev.map((e) => (e.id === toSave.id || e.firebaseId === toSave.firebaseId ? toSave : e));
        } else {
          return [toSave, ...prev];
        }
      });

      setCurrentEntry(toSave);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 1200);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save entry. Check console for details.");
    }
  };

  // --- debounced autoSave (keeps UI snappy) ---
  const autoSave = (updated) => {
    // store latest pending
    pendingSaveRef.current = updated;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const toCommit = pendingSaveRef.current;
      await saveNow(toCommit);
      pendingSaveRef.current = null;
      saveTimer.current = null;
    }, 800);
  };

  // update helpers
  const updateField = (field, val) => {
    const updated = { ...currentEntry, [field]: val };
    setCurrentEntry(updated);
    autoSave(updated);
  };

  const updateArray = (field, index, val) => {
    const updatedArr = [...(currentEntry[field] || [])];
    updatedArr[index] = val;
    updateField(field, updatedArr);
  };

  // --- NEW ENTRY (create in Firestore immediately so it has firebaseId) ---
  const newEntry = async () => {
    const fresh = makeEntry();
    fresh.summary = makeSummary(fresh);
    fresh.timestamp = Date.now();

    try {
      const docRef = await addDoc(collection(db, "journalEntries"), {
        userId: auth.currentUser.uid,
        ...fresh,
      });
      fresh.firebaseId = docRef.id;

      setEntries((prev) => [fresh, ...prev]);
      setCurrentEntry(fresh);
    } catch (err) {
      console.error("New entry failed:", err);
      alert("Failed to create new entry.");
    }
  };

  // --- DELETE ENTRY ---
  const deleteEntry = async () => {
    if (!window.confirm("Delete this worksheet?")) return;

    try {
      if (currentEntry.firebaseId) {
        await deleteDoc(doc(db, "journalEntries", currentEntry.firebaseId));
      }
      const filtered = entries.filter((e) => !(e.id === currentEntry.id || e.firebaseId === currentEntry.firebaseId));
      setEntries(filtered);
      setCurrentEntry(filtered[0] || makeEntry());
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete entry.");
    }
  };

  // --- select an entry from left list (save current first) ---
  const selectEntry = async (entry) => {
    // save current entry immediately before switching (if changes)
    await saveNow(currentEntry);
    setCurrentEntry(entry);
  };

  // pretty date util
  const prettyDate = (iso) =>
    new Date(iso || new Date().toISOString()).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // --- UI ---
  return (
    <div className="min-h-screen bg-[#FFF7FB] p-6">
      <style>{`
        .cute-box { background: #FCEFFE; padding: 14px; border-radius: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
        .cute-input { width: 100%; resize: none; background: transparent; border: none; outline: none; font-size: 1rem; color: #333; }
        .section-title { font-size: 1.05rem; color: #6A3EA1; font-weight: 600; margin-bottom: 8px; display: flex; gap: 6px; align-items: center; }
        .journal-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; max-width: 1200px; margin: 0 auto; align-items: start; }
        .entries-list { background: white; border-radius: 16px; padding: 12px; box-shadow: 0 6px 20px rgba(106,62,161,0.06); height: 80vh; overflow: auto; }
        .entry-item { display:flex; gap:10px; align-items:center; padding:10px; border-radius:12px; cursor:pointer; transition: background 0.18s, transform 0.12s; }
        .entry-item:hover { background: #fff0f6; transform: translateX(4px); }
        .entry-item.active { background: linear-gradient(90deg,#FFEEF4,#FFF7FA); box-shadow: 0 6px 18px rgba(255,150,180,0.12); }
        .entry-emoji { font-size: 22px; width:36px; text-align:center; }
        .entry-meta { flex:1; }
        .entry-date { color:#6A3EA1; font-weight:700; font-size:14px; }
        .entry-snippet { color:#444; font-size:13px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 190px; }
        .editor-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(106,62,161,0.06); min-height: 80vh; overflow: auto; }
        .top-actions { display:flex; gap:10px; justify-content:flex-end; margin-bottom:10px; }
        .btn { padding:8px 12px; border-radius:10px; border:none; cursor:pointer; font-weight:600; }
        .btn.primary { background: linear-gradient(135deg,#FFB7C5,#FF8EA1); color: white; }
        .btn.ghost { background: transparent; border:1px solid rgba(106,62,161,0.08); color: #6A3EA1; }
        .saved-toast { position: fixed; bottom: 18px; right: 18px; background: #FF9FB0; color: white; padding: 10px 14px; border-radius: 999px; box-shadow: 0 8px 24px rgba(255,150,180,0.18); }
      `}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#6A3EA1]">🌸 My Private Space</h1>

          <div className="flex gap-3">
            <button
              onClick={newEntry}
              className="btn primary"
              title="Create a new blank entry"
            >
              ✨ New Entry
            </button>
            <button
              onClick={() => saveNow(currentEntry)}
              className="btn ghost"
              title="Save now"
            >
              💾 Save
            </button>
            <button
              onClick={deleteEntry}
              className="btn"
              style={{ background: "#FFEDED", color: "#E24D4D" }}
              title="Delete this entry"
            >
              🗑 Delete
            </button>
          </div>
        </div>

        <div className="journal-layout">
          {/* LEFT: entries list */}
          <div className="entries-list">
            {loading ? (
              <div style={{ padding: 20, color: "#6A3EA1" }}>Loading...</div>
            ) : entries.length === 0 ? (
              <div style={{ padding: 20 }}>No entries yet</div>
            ) : (
              entries.map((e) => {
                const active =
                  (currentEntry.firebaseId && e.firebaseId === currentEntry.firebaseId) ||
                  e.id === currentEntry.id;
                return (
                  <div
                    key={e.firebaseId || e.id}
                    className={`entry-item ${active ? "active" : ""}`}
                    onClick={() => selectEntry(e)}
                  >
                    <div className="entry-emoji">{e.moodEmoji || "🌸"}</div>
                    <div className="entry-meta">
                      <div className="entry-date">{prettyDate(e.date)}</div>
                      <div className="entry-snippet">
                        {e.summary || makeSummary(e)}
                      </div>
                    </div>
                    <div style={{ color: "#AAA", fontSize: 12 }}>{/* optional small icon */}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: editor */}
          <div className="editor-card">
            <div className="text-lg font-medium text-[#555] mb-4">📅 {prettyDate(currentEntry.date)}</div>

            {/* Question grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              {/* Q1 */}
              <div>
                <div className="section-title">😟 What is making me anxious?</div>
                <div className="cute-box">
                  <textarea
                    rows={6}
                    value={currentEntry.anxiousReason}
                    onChange={(e) => updateField("anxiousReason", e.target.value)}
                    className="cute-input"
                    placeholder="Write here..."
                  />
                </div>
              </div>

              {/* Q2 */}
              <div>
                <div className="section-title">💭 Things that made me happy today</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {currentEntry.negativeThoughts?.map((t, i) => (
                    <div key={i} className="cute-box">
                      <textarea
                        rows={2}
                        value={t}
                        onChange={(e) => updateArray("negativeThoughts", i, e.target.value)}
                        className="cute-input"
                        placeholder={`Negative thought ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <div className="section-title">🫀 How is my body responding?</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {currentEntry.bodyResponse?.map((b, i) => (
                    <div key={i} className="cute-box">
                      <textarea
                        rows={2}
                        value={b}
                        onChange={(e) => updateArray("bodyResponse", i, e.target.value)}
                        className="cute-input"
                        placeholder={`Body response ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div>
                <div className="section-title">😰 Things I like about myself</div>
                <div className="cute-box">
                  <textarea
                    rows={6}
                    value={currentEntry.worstOutcome}
                    onChange={(e) => updateField("worstOutcome", e.target.value)}
                    className="cute-input"
                    placeholder="Describe..."
                  />
                </div>
              </div>

              {/* Q5 */}
              <div>
                <div className="section-title">🌈 Positive thoughts to calm my mind</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {currentEntry.positiveThoughts?.map((p, i) => (
                    <div key={i} className="cute-box">
                      <textarea
                        rows={2}
                        value={p}
                        onChange={(e) => updateArray("positiveThoughts", i, e.target.value)}
                        className="cute-input"
                        placeholder={`Positive thought ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Q6 */}
              <div>
                <div className="section-title">🛡 What can I control?</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {currentEntry.controlSteps?.map((c, i) => (
                    <div key={i} className="cute-box">
                      <textarea
                        rows={2}
                        value={c}
                        onChange={(e) => updateArray("controlSteps", i, e.target.value)}
                        className="cute-input"
                        placeholder={`Control step ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Full width Q */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="section-title">🧘‍♀️ What can I do to calm my body?</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {currentEntry.calmBodySteps?.map((c, i) => (
                    <div key={i} className="cute-box">
                      <textarea
                        rows={2}
                        value={c}
                        onChange={(e) => updateArray("calmBodySteps", i, e.target.value)}
                        className="cute-input"
                        placeholder={`Calm step ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showSaved && <div className="saved-toast">💗 Saved!</div>}
      </div>
    </div>
  );
}
