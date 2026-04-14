import mongoose from "mongoose";
import dbConnect from "../../../lib/mongodb";
import MCQ from "../../../lib/models/MCQ";
import Progress from "../../../lib/models/Progress";
import Leaderboard from "../../../lib/models/Leaderboard";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, username, topic, answers } = req.body;
  // answers: [{ id: mcqId, userAnswer: "A" }, ...]

  if (!userId || !topic || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: "userId, topic, and answers are required" });
  }

  // Sanitize string inputs to prevent NoSQL injection
  const safeUserId = String(userId).slice(0, 128);
  const safeTopic = String(topic).slice(0, 256);
  const safeUsername = username ? String(username).slice(0, 128) : safeUserId;

  try {
    await dbConnect();

    let score = 0;
    const results = [];

    for (const { id, userAnswer } of answers) {
      // Validate that id is a proper MongoDB ObjectId before querying
      if (!mongoose.Types.ObjectId.isValid(id)) continue;
      const mcq = await MCQ.findById(id);
      if (!mcq) continue;

      const isCorrect = mcq.correctAnswer === userAnswer;
      if (isCorrect) score++;

      mcq.userAnswer = userAnswer;
      mcq.isCorrect = isCorrect;
      await mcq.save();

      results.push({
        id,
        question: mcq.question,
        userAnswer,
        correctAnswer: mcq.correctAnswer,
        isCorrect,
      });
    }

    const total = answers.length;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

    // Save progress
    await Progress.create({ userId: safeUserId, topic: safeTopic, score, total, accuracy });

    // Update leaderboard
    await Leaderboard.findOneAndUpdate(
      { userId: safeUserId },
      {
        $inc: { totalScore: score, totalAttempts: total },
        $set: { username: safeUsername },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ score, total, accuracy, results });
  } catch (error) {
    console.error("MCQ evaluate error:", error);
    res.status(500).json({ error: "Failed to evaluate MCQs" });
  }
}
