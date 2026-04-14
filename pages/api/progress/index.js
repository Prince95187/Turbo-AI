import dbConnect from "../../../lib/mongodb";
import Progress from "../../../lib/models/Progress";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Sanitize userId to prevent NoSQL injection (coerce to string)
    const safeUserId = String(userId).slice(0, 128);

    try {
      await dbConnect();

      const records = await Progress.find({ userId: safeUserId }).sort({ date: -1 }).limit(50);

      // Compute stats
      const topicMap = {};
      for (const r of records) {
        if (!topicMap[r.topic]) {
          topicMap[r.topic] = { attempts: 0, totalScore: 0, totalQuestions: 0 };
        }
        topicMap[r.topic].attempts++;
        topicMap[r.topic].totalScore += r.score;
        topicMap[r.topic].totalQuestions += r.total;
      }

      const topicStats = Object.entries(topicMap).map(([topic, data]) => ({
        topic,
        attempts: data.attempts,
        accuracy: data.totalQuestions > 0
          ? Math.round((data.totalScore / data.totalQuestions) * 100)
          : 0,
      }));

      // Sort to find weak topics (lowest accuracy)
      topicStats.sort((a, b) => a.accuracy - b.accuracy);

      const overallAccuracy =
        records.length > 0
          ? Math.round(
              records.reduce((sum, r) => sum + r.accuracy, 0) / records.length
            )
          : 0;

      res.status(200).json({ records, topicStats, overallAccuracy });
    } catch (error) {
      console.error("Progress GET error:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
