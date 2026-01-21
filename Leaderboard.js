import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function Leaderboard({ goBack, playAgain }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/leaderboard")
      .then((res) => {
        // Sort descending by score & show only top 5
        const topScores = res.data
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        setScores(topScores);
      });
  }, []);

  // Medal emojis for top 3
  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  return (
    <div className="container">
      <h1>Leaderboard</h1>

      {scores.map((s, i) => (
        <div className="leaderboard-item" key={i}>
          <span>
            {getMedal(i)} #{i + 1} {s.name}
          </span>
          <span>{s.score}</span>
        </div>
      ))}

      <button className="secondary-btn" onClick={goBack}>
        Back
      </button>
      <button className="primary-btn" onClick={playAgain}>
        Play Again
      </button>
    </div>
  );
}

export default Leaderboard;
