import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, requestNotificationPermission } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Save notification token in backend after login
  const handleLoginSuccess = async (userId) => {
    const token = await requestNotificationPermission();
    if (token) {
      await fetch("http://localhost:8080/saveToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token }),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userId = res.user.uid; 

      await handleLoginSuccess(userId); 

      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userId = res.user.uid; 

      await handleLoginSuccess(userId); 

      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; }

    .auth-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #FFE5EE, #F5EBFF);
    }

    .auth-card {
      background: white;
      width: 380px;
      padding: 40px 30px;
      border-radius: 30px;
      box-shadow: 0 10px 30px rgba(184, 180, 227, 0.3);
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .auth-card::before {
      content: "💗";
      position: absolute;
      top: -30px;
      right: -30px;
      font-size: 80px;
      opacity: 0.1;
    }

    .auth-card h2 { color: #6A3EA1; font-size: 32px; margin-bottom: 10px; }
    .auth-card p { color: #777; font-size: 15px; margin-bottom: 30px; }

    .auth-input {
      width: 100%;
      padding: 14px;
      border-radius: 20px;
      border: 1px solid #ccc;
      margin-bottom: 20px;
      font-size: 15px;
    }

    .auth-btn {
      width: 100%;
      padding: 14px;
      border-radius: 25px;
      border: none;
      background: linear-gradient(135deg, #FFB7C5, #FF9FB0);
      color: white;
      font-size: 17px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
      margin-bottom: 10px;
    }

    .auth-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 183, 197, 0.4);
    }

    .auth-btn-google {
      background: #ea5074;
      color: white;
    }

    .auth-switch {
      margin-top: 18px;
      color: #6A3EA1;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="auth-container">
        <div className="auth-card">
          <h2>HeartTalk 💗</h2>
          <p>Login to continue your wellness journey</p>

          <form onSubmit={handleLogin}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="auth-btn">Login</button>
          </form>

          <button
            className="auth-btn auth-btn-google"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </button>

          <div className="auth-switch" onClick={() => navigate("/signup")}>
            Don't have an account? Sign up ✨
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
