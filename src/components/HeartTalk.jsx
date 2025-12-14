import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";



const HeartTalk = () => {
useEffect(() => {
  const handleSmoothScroll = (e) => {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  document.addEventListener('click', handleSmoothScroll);
  return () => document.removeEventListener('click', handleSmoothScroll);
}, []);


const navigate = useNavigate();

const handleCardClick = (path) => {
  navigate(path);
};


  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .hearttalk-app {
      font-family: 'Poppins', sans-serif;
      background: #FFF7FA;
      color: #333333;
      overflow-x: hidden;
    }

    .container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
    }

    /* Navigation */
    nav {
      padding: 25px 0;
      background: rgba(255, 247, 250, 0.95);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 20px rgba(184, 180, 227, 0.1);
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 28px;
      font-weight: 600;
      color: #6A3EA1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo::before {
      content: "💗";
      font-size: 32px;
    }

    .nav-links {
      display: flex;
      gap: 30px;
      align-items: center;
    }

    .nav-links a {
      text-decoration: none;
      color: #333;
      transition: color 0.3s;
      font-weight: 400;
    }

    .nav-links a:hover {
      color: #FFB7C5;
    }

    .btn-primary {
      background: linear-gradient(135deg, #FFB7C5, #FF9FB0);
      color: white;
      padding: 12px 28px;
      border-radius: 25px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(255, 183, 197, 0.3);
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 183, 197, 0.4);
    }

    .btn-secondary {
      background: transparent;
      color: #6A3EA1;
      padding: 12px 28px;
      border-radius: 25px;
      border: 2px solid #6A3EA1;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-secondary:hover {
      background: #6A3EA1;
      color: white;
      transform: translateY(-2px);
    }

    /* Hero Section – full width */
    .hero {
      width: 100%;
      padding: 120px 20px;
      text-align: center;
      background: linear-gradient(180deg, #FFF7FA 0%, #F5EBFF 100%);
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: "";
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(184, 180, 227, 0.2), transparent);
      border-radius: 50%;
      top: -100px;
      right: -100px;
      animation: float 6s ease-in-out infinite;
    }

    .hero::after {
      content: "";
      position: absolute;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 183, 197, 0.15), transparent);
      border-radius: 50%;
      bottom: -80px;
      left: -80px;
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: auto;
    }

    .hero h1 {
      font-size: 56px;
      color: #6A3EA1;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .hero p {
      font-size: 20px;
      color: #666;
      margin-bottom: 40px;
      font-weight: 300;
      line-height: 1.7;
    }

    .hero-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .hero-illustration {
      margin-top: 60px;
      font-size: 120px;
      animation: gentle-pulse 3s ease-in-out infinite;
    }

    @keyframes gentle-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Features */
    .features {
      padding: 100px 0;
      background: #FFF7FA;
    }

    .section-title {
      font-size: 42px;
      color: #6A3EA1;
      text-align: center;
      margin-bottom: 15px;
    }

    .section-subtitle {
      font-size: 18px;
      color: #666;
      text-align: center;
      margin-bottom: 60px;
      font-weight: 300;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
    }

    .feature-card {
      background: white;
      padding: 40px 30px;
      border-radius: 25px;
      text-align: center;
      transition: all 0.4s;
      box-shadow: 0 5px 25px rgba(184, 180, 227, 0.15);
      cursor: pointer;
    }

    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 30px rgba(184, 180, 227, 0.25);
    }

    .feature-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .feature-card:nth-child(1) {
      background: linear-gradient(135deg, #E8E5FF, #D5D0FF);
    }
    .feature-card:nth-child(2) {
      background: linear-gradient(135deg, #FFE5EE, #FFD0E0);
    }
    .feature-card:nth-child(3) {
      background: linear-gradient(135deg, #D9F3FF, #C0E8FF);
    }

    /* Wellness Tools */
    .wellness-tools {
      padding: 100px 0;
      background: linear-gradient(135deg, #F5EBFF, #FFF7FA);
    }

    .tools-grid {
      display: grid;
      gap: 30px;
      margin-top: 60px;
    }

    .tools-grid {
  display: grid;
   grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 60px;
}

    .tool-card {
      background: white;
      padding: 40px;
      border-radius: 25px;
      display: flex;
      align-items: center;
      gap: 30px;
      transition: all 0.4s;
      box-shadow: 0 5px 25px rgba(184, 180, 227, 0.15);
      cursor: pointer;
    }

    .tool-card:hover {
      transform: translateX(10px);
      box-shadow: 0 8px 30px rgba(184, 180, 227, 0.25);
    }

    .tool-card:nth-child(1) {
      background: linear-gradient(135deg, #ACE7FF, #8BD9FF);
    }
    .tool-card:nth-child(2) {
      background: linear-gradient(135deg, #B8B4E3, #9B96D5);
    }
    .tool-card:nth-child(3) {
      background: linear-gradient(135deg, #FFB7C5, #FF9FB0);
    }

     .tool-card:nth-child(4) {
      background: linear-gradient(135deg, #b7ffbeff, #66b863ff);
    }

    .tool-icon {
      font-size: 56px;
    }

    .tool-content h3 {
      font-size: 26px;
      color: white;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .tool-content p {
      color: rgba(255, 255, 255, 0.95);
      font-weight: 300;
      line-height: 1.7;
    }

    /* About Section */
.about {
  padding: 100px 0;
  background: #FFF7FA;
}

.about-content {
  display: flex;
  align-items: center;
  gap: 60px;
  margin-top: 50px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.about-text {
  flex: 1;
  min-width: 300px;
}

.about-text h3 {
  font-size: 28px;
  color: #6A3EA1;
  margin-bottom: 15px;
}

.about-text p {
  font-size: 17px;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.8;
  font-weight: 300;
}

.about-illustration {
  font-size: 120px;
  animation: gentle-pulse 3s ease-in-out infinite;
  flex: 1;
  min-width: 250px;
  text-align: center;
}

@media (max-width: 768px) {
  .about-content {
    flex-direction: column;
    text-align: center;
  }
}

/px 30px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(184, 180, 227, 0.15);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

@media (prefers-color-scheme: light) {
    button {
        background-color: #de084fff;
    }
}
.profile-btn {
  background: #FFB7C5; /* subtle pink */
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.profile-btn:hover {
  background: #FF9FB0;
  transform: translateY(-1px);
}

    /* Footer */
    footer {
      background: linear-gradient(135deg, #F5EBFF, #E8E5FF);
      padding: 60px 0 30px;
      text-align: center;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .footer-links a {
      color: #6A3EA1;
      text-decoration: none;
      transition: 0.3s;
    }

    .footer-links a:hover {
      color: #FFB7C5;
    }

    .footer-text {
      font-size: 14px;
      color: #666;
      font-weight: 300;
    }

    .footer-text span {
      color: #FFB7C5;
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero h1 { font-size: 38px; }
      .tool-card { flex-direction: column; text-align: center; }
      .features-grid { grid-template-columns: 1fr; }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="hearttalk-app">
        
        {/* Navigation */}
  <nav>
  <div className="container">
    <div className="nav-content">
      <div className="logo">HeartTalk</div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#wellness">Wellness</a>
        <a href="#about">About</a>
         <button className="profile-btn" onClick={() => window.location.href="/Profile"}>
          Profile
        </button>
      </div>
    </div>
  </div>
</nav>



        {/* Hero Section - full width */}
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>Every Feeling Matters<br /> Talk. Heal. Grow.</h1>
            <p>HeartTalk helps you track your mood, write your thoughts, and talk to an AI that listens without judgment. Start your emotional wellness journey today.</p>
            <div className="hero-buttons">
  <button
          className="btn-primary"
          onClick={() => navigate("/mood-check")}
        >
          Start your journey
        </button>

               <button
          className="btn-primary"
          onClick={() => navigate("/Chatbot")}
        >
          Here For You
        </button>
            </div>
            <div className="hero-illustration">💗✨🌸</div>
          </div>
        </section>


{/* About Section */}
<section className="about" id="about">
  <div className="container">
    <h2 className="section-title">About HeartTalk</h2>
    <p className="section-subtitle">
      A safe, warm space where your emotions are truly heard.
    </p>

    <div className="about-content">
      <div className="about-text">
        <h3>Your Digital Emotional Wellness Companion</h3>
        <p>
          HeartTalk is designed to support you on your mental wellbeing journey.
          Whether you’re tracking your mood, writing your thoughts, or chatting 
          with our emotional-support AI, HeartTalk provides gentle and uplifting 
          tools to help you feel lighter and more in control.
        </p>

        <p>
          Built with love, care, and science-backed wellness practices — HeartTalk 
          empowers you to understand your emotions deeply and grow through them.
        </p>

        <p>
          You are never alone. Every feeling matters. Every moment counts.
        </p>
      </div>

      <div className="about-illustration">💗🌿✨</div>
    </div>
  </div>
</section>

{/* Features Section */}
<section className="features" id="features">
  <div className="container">
    <h2 className="section-title"> Tools to support your emotional wellness journey</h2>
   

    <div className="features-grid">
      <div className="feature-card" onClick={() => handleCardClick("/MoodCalendar")}>
        <div className="feature-icon">😊</div>
        <h3>Mood Tracking</h3>
        <p>Understand your emotions day by day. Track patterns and triggers.</p>
      </div>

      <div className="feature-card" onClick={() => handleCardClick("/MoodJournal")}>
        <div className="feature-icon">📔</div>
        <h3>Journaling</h3>
        <p>Write freely in your own private space.</p>
      </div>

      <div className="feature-card" onClick={() => handleCardClick("/HeartTalkColoring")}>
        <div className="feature-icon">👾</div>
        <h3>Play Games</h3>
        <p>Engage your brain and lift your mood with fun mini-games.</p>
      </div>
    </div>
  </div>
</section>



 {/* Wellness Tools Section */}
<section className="wellness-tools" id="wellness">
  <div className="container">
    <h2 className="section-title">Wellness Tools for Calm</h2>
    <p className="section-subtitle">
      Explore calming practices designed to ease your mind
    </p>


<div className="tools-grid">
  <div className="tool-card" onClick={() => handleCardClick("/RelaxingMusic")}>
    <div className="tool-icon">🎵</div>
    <div className="tool-content">
      <h3>Relaxing Sound Library</h3>
      <p>Soothing sounds and ambient music to help you relax, focus, or drift into peaceful sleep.</p>
    </div>
  </div>

  <div className="tool-card" onClick={() => handleCardClick("/Breathing")}>
    <div className="tool-icon">💆‍♀️</div>
    <div className="tool-content">
      <h3>Breathing Exercise</h3>
      <p>Guided breathing exercises to calm your mind and reduce stress.</p>
    </div>
  </div>

  <div className="tool-card" onClick={() => handleCardClick("/DailyPlanner")}>
    <div className="tool-icon">📝</div>
    <div className="tool-content">
      <h3>Daily Planner</h3>
      <p>Plan Your Day the way you want.</p>
    </div>
  </div>


  <div className="tool-card" onClick={() => handleCardClick("/HeartTalkAffirmations")}>
    <div className="tool-icon">🪶</div>
    <div className="tool-content">
      <h3>Affirmations</h3>
      <p>Positive affirmations to uplift your mood and start your day with calm.</p>
    </div>
  </div>
</div> 
  </div>
</section>

{/*faq*/}





        {/* Footer */}
        <footer>
          <div className="container">
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact</a>
              <a href="#">Support</a>
            </div>
            <p className="footer-text">Made with <span>💗</span> for your wellbeing</p>
            <p className="footer-text">© 2025 HeartTalk. Your safe space, always.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HeartTalk;
