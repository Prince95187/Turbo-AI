import dbConnect from "../../../lib/mongodb";
import Leaderboard from "../../../lib/models/Leaderboard";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await dbConnect();

      const entries = await Leaderboard.find({})
        .sort({ totalScore: -1 })
        .limit(20);

      // Assign ranks
      const ranked = entries.map((entry, idx) => ({
        rank: idx + 1,
        userId: entry.userId,
        username: entry.username,
        totalScore: entry.totalScore,
        totalAttempts: entry.totalAttempts,
        accuracy:
          entry.totalAttempts > 0
            ? Math.round((entry.totalScore / entry.totalAttempts) * 100)
            : 0,
      }));

      res.status(200).json({ leaderboard: ranked });
    } catch (error) {
      console.error("Leaderboard GET error:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
