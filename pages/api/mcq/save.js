import dbConnect from "../../../lib/mongodb";
import MCQ from "../../../lib/models/MCQ";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, topic, questions } = req.body;

  if (!userId || !topic || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "userId, topic, and questions are required" });
  }

  // Sanitize string inputs to prevent NoSQL injection
  const safeUserId = String(userId).slice(0, 128);
  const safeTopic = String(topic).slice(0, 256);

  try {
    await dbConnect();

    const docs = questions.map((q) => ({
      userId: safeUserId,
      topic: safeTopic,
      question: String(q.question || "").slice(0, 1000),
      options: Array.isArray(q.options) ? q.options.map((o) => String(o).slice(0, 256)) : [],
      correctAnswer: String(q.correctAnswer || "").slice(0, 256),
    }));

    const saved = await MCQ.insertMany(docs);
    res.status(201).json({ saved: saved.length, ids: saved.map((d) => d._id) });
  } catch (error) {
    console.error("MCQ save error:", error);
    res.status(500).json({ error: "Failed to save MCQs" });
  }
}
