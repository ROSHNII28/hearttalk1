import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully 🎉");
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .auth-container {
      height: 100vh;
      background: linear-gradient(135deg, #E8E5FF, #FFE5EE);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Poppins', sans-serif;
    }
    .auth-card {
      background: white;
      width: 400px;
      padding: 40px 30px;
      border-radius: 25px;
      box-shadow: 0 8px 30px rgba(184, 180, 227, 0.25);
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
    .auth-card p { color: #777; margin-bottom: 35px; font-size: 15px; }

    .auth-input {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #ccc;
      margin-bottom: 18px;
      font-size: 15px;
    }

    .auth-btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #B8B4E3, #6A3EA1);
      color: white;
      font-size: 17px;
      cursor: pointer;
      transition: 0.3s;
      margin-bottom: 10px;
    }
    .auth-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(106, 62, 161, 0.4);
    }

    .auth-btn-google {
      background: #ea5074;
      color: white;
    }

    .auth-switch {
      margin-top: 20px;
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
          <h2>Create Account ✨</h2>
          <p>Your safe space begins now</p>

          <form onSubmit={handleSignup}>
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
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="auth-btn">Sign Up</button>
          </form>

          <button
            className="auth-btn auth-btn-google"
            onClick={handleGoogleSignup}
          >
            Sign Up with Google
          </button>

          <div className="auth-switch" onClick={() => navigate("/")}>
            Already have an account? Login
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
