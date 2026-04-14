import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `You are Turbo AI, an expert NEET tutor with deep knowledge of Physics, Chemistry, and Biology.
You help students prepare for the NEET (National Eligibility cum Entrance Test) exam.
Be concise, accurate, and encouraging. Use simple language and examples when explaining concepts.
If a student asks something unrelated to NEET subjects, gently redirect them to their studies.`,
        },
        ...messages,
      ],
      max_tokens: 1000,
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI chat error:", error);
    res.status(500).json({ error: "Failed to get response. Please try again." });
  }
}
