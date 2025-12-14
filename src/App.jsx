// App.jsx
import { Route, Routes } from "react-router-dom"; // no Router here
import Breathing from "./components/Breathing";
import Chatbot from "./components/Chatbot";
import DailyPlanner from "./components/DailyPlanner";
import HeartTalk from "./components/HeartTalk";
import HeartTalkAffirmations from "./components/HeartTalkAffirmations";
import HeartTalkColoring from "./components/HeartTalkColoring";
import MoodCalendar from "./components/MoodCalendar";
import MoodCheck from "./components/MoodCheck";
import MoodJournal from "./components/MoodJournal";
import RelaxingMusic from "./components/RelaxingMusic";
import Profile from "./pages/Profile";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<HeartTalk />} />
        <Route path="/profile" element={<Profile />} />


      <Route path="/mood-check" element={<MoodCheck />} />
      <Route path="/HeartTalkColoring" element={<HeartTalkColoring />} />
         <Route path="/RelaxingMusic" element={<RelaxingMusic />} />
         <Route path="HeartTalkAffirmations"element={<HeartTalkAffirmations />}/>
         <Route path="Breathing"element={<Breathing />}/>
      <Route path="/MoodCalendar" element={<MoodCalendar />} />
      <Route path="/MoodJournal" element={<MoodJournal />} />
       <Route path="/DailyPlanner" element={<DailyPlanner />} />
      <Route path="/Chatbot" element={<Chatbot />} />
    </Routes>
  );
}

export default App;


