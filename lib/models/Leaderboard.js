import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    totalScore: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Leaderboard ||
  mongoose.model("Leaderboard", LeaderboardSchema);
