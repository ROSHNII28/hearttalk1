import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, disableAnonymousLogin, signOut } from "../firebase";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const colors = {
    pink: "#FFB7C5",
    purple: "#6A3EA1",
    bg: "#FFF7FA",
    text: "#333333",
  };

  // Fetch current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const navigate = useNavigate(); // initialize navigate

  // Handle logout
  const handleLogout = async () => {
    try {
      disableAnonymousLogin?.(); // 
      await signOut(auth);
      setShowLogoutModal(false);
      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold" style={{ color: colors.purple }}>
           💗 HeartTalk
          </span>
          <div className="flex gap-4">
          </div>
        </div>
      </nav>

      {/* Profile Card */}
      <div className="w-full flex justify-center px-4 py-10">
        <div
          className="rounded-3xl p-10 shadow-lg w-full max-w-3xl mx-auto"
          style={{ background: colors.bg, border: `2px solid rgba(255,183,197,0.6)` }}
        >
          {/* Avatar */}
          <div className="text-center mb-10">
            <div
              className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.purple}, ${colors.pink})`,
                border: "5px solid white",
              }}
            >
            </div>
            <h1 className="text-5xl font-bold mb-4" style={{ color: colors.purple }}>
              My Profile
            </h1>
            <p><b>Email:</b> {user?.email || "Anonymous"}</p>
            <p><b>User ID:</b> {user?.uid}</p>
          </div>

          {/* Settings */}
          <div
            className="rounded-3xl p-8 shadow-lg w-full max-w-lg mx-auto"
            style={{ background: colors.bg, border: `2px solid rgba(255,183,197,0.5)` }}
          >
            <h2 className="text-3xl font-bold text-center mb-6" style={{ color: colors.purple }}>
              Settings
            </h2>
            <div className="flex flex-col gap-4 items-center">
              <button
                className="flex justify-between items-center py-4 px-5 rounded-xl text-lg w-full max-w-md setting-btn"
                style={{ color: colors.text }}
              >
                Notifications <span className="text-2xl">🔔</span>
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex justify-between items-center py-4 px-5 rounded-xl text-lg w-full max-w-md setting-btn"
                style={{ color: colors.text }}
              >
                Logout <span className="text-2xl">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 px-4" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: colors.purple }}>Logout?</h3>
            <p className="text-lg mb-6" style={{ color: colors.text }}>Are you sure you want to logout?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-lg"
                style={{ background: colors.bg, color: colors.purple }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl font-semibold text-lg text-white"
                style={{ background: colors.pink }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hover + Font Styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .setting-btn { 
          transition: 0.25s; 
          background: white;
        }
        .setting-btn:hover { 
          background: rgba(255,183,197,0.2); 
          transform: scale(1.01); 
        }
      `}</style>
    </div>
  );
}
