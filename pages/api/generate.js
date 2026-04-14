import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic, mode } = req.body;

  if (!topic || !mode) {
    return res.status(400).json({ error: "topic and mode are required" });
  }

  const validModes = ["notes", "mcq", "revision"];
  if (!validModes.includes(mode)) {
    return res.status(400).json({ error: `mode must be one of: ${validModes.join(", ")}` });
  }

  let prompt = "";

  if (mode === "notes") {
    prompt = `You are Turbo AI — a smart NEET tutor.

Topic: ${topic}

Generate comprehensive, well-structured notes for NEET preparation on this topic.
Include:
1. Key concepts and definitions
2. Important formulas (if applicable)
3. Diagrams descriptions or mnemonics
4. High-yield points for NEET exam
5. Common mistakes to avoid

Format the output clearly with headings and bullet points.`;
  } else if (mode === "mcq") {
    prompt = `You are Turbo AI — a smart NEET tutor.

Topic: ${topic}

Generate 5 high-quality NEET-style Multiple Choice Questions (MCQs).

For EACH question use EXACTLY this format:
Q1. [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Answer: [Correct option letter]
Explanation: [Brief explanation]

---

Generate all 5 questions following this exact format.`;
  } else if (mode === "revision") {
    prompt = `You are Turbo AI — a smart NEET tutor.

Topic: ${topic}

Create a quick revision sheet for NEET. Include:
1. 🔑 Key points (bullet list, max 10)
2. ⚡ Quick formulas or facts
3. 🧠 Memory tricks / mnemonics
4. ❓ 3 rapid-fire questions with answers
5. ⚠️ Common exam traps

Keep it concise and exam-focused.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    const result = response.choices[0].message.content;
    res.status(200).json({ result, mode, topic });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to generate content. Please try again." });
  }
}
