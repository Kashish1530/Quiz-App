const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Score = require("./models/Score");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/quiz");

// ✅ Sample questions
const questions = [
  { question: "What is React?", options: ["Library", "Framework", "Language"], answer: "Library" },
  { question: "Which hook is used for state?", options: ["useEffect", "useState", "useRef"], answer: "useState" },
  { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets"], answer: "Cascading Style Sheets" },
  { question: "Which company developed React?", options: ["Facebook", "Google", "Microsoft"], answer: "Facebook" },
  { question: "What is JSX?", options: ["A syntax extension", "A library", "A framework"], answer: "A syntax extension" },
];

// ✅ Route to fetch questions dynamically
app.get("/questions", (req, res) => {
  res.json(questions);
});

// Submit score to database
app.post("/submit", async (req, res) => {
  await Score.create(req.body);
  res.send("Saved");
});

// Get leaderboard
app.get("/leaderboard", async (req, res) => {
  const data = await Score.find().sort({ score: -1 });
  res.json(data);
});

// Only **one listen** at the end
app.listen(5000, () => console.log("Server running on port 5000"));
