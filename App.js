import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Leaderboard from "./Leaderboard";

function App() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizOver, setQuizOver] = useState(false);
  const [current, setCurrent] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [questions, setQuestions] = useState([]); // ✅ questions state

  // Fetch questions from API when quiz starts
  useEffect(() => {
    if (started) {
      axios
        .get("http://localhost:5000/questions")
        .then((res) => setQuestions(res.data))
        .catch((err) => console.error(err));
    }
  }, [started]);

  // Timer logic
  useEffect(() => {
    if (!started || quizOver || questions.length === 0) return;

    if (timeLeft === 0) {
      setQuizOver(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizOver, started, questions]);

  // Submit score to backend
  useEffect(() => {
    if (quizOver && name) {
      axios.post("http://localhost:5000/submit", { name, score });
    }
  }, [quizOver, name, score]);

  const handleAnswer = (opt) => {
    if (opt === questions[current].answer) setScore((s) => s + 1);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTimeLeft(15);
    } else {
      setQuizOver(true);
    }
  };

  const playAgain = () => {
    setStarted(false);
    setQuizOver(false);
    setCurrent(0);
    setScore(0);
    setTimeLeft(15);
    setShowLeaderboard(false);
  };

  // Screens
  if (showLeaderboard) return <Leaderboard goBack={() => setShowLeaderboard(false)} playAgain={playAgain} />;

  if (!started) {
    return (
      <div className="container">
        <h1>Quiz App</h1>
        <input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="primary-btn" onClick={() => setStarted(true)} disabled={!name}>
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizOver) {
    return (
      <div className="container">
        <h1>Quiz Over</h1>
        <p className="score">Your Score: {score}</p>
        <button className="primary-btn" onClick={() => setShowLeaderboard(true)}>
          View Leaderboard
        </button>
        <button className="secondary-btn" onClick={playAgain}>
          Play Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) return <div className="container">Loading questions...</div>; // show loading

  return (
    <div className="container">
      <p className="timer">⏱ Time Left: {timeLeft}s</p>
      <h2>{questions[current].question}</h2>
      {questions[current].options.map((opt) => (
        <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)}>
          {opt}
        </button>
      ))}
      <button className="secondary-btn" onClick={() => setQuizOver(true)}>
        Submit Quiz
      </button>
    </div>
  );
}

export default App;
