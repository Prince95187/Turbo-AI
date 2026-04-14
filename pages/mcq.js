import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function parseMCQsFromText(text) {
  const questions = [];
  // Split by Q1., Q2. etc.
  const blocks = text.split(/\n(?=Q\d+\.)/);

  for (const block of blocks) {
    const lines = block.trim().split("\n").filter(Boolean);
    if (lines.length < 6) continue;

    const questionLine = lines[0].replace(/^Q\d+\.\s*/, "").trim();
    const optionLines = lines.slice(1, 5);
    const answerLine = lines.find((l) => l.startsWith("Answer:"));
    const explanationLine = lines.find((l) => l.startsWith("Explanation:"));

    if (!questionLine || optionLines.length < 4 || !answerLine) continue;

    const options = optionLines.map((l) => l.replace(/^[A-D]\)\s*/, "").trim());
    const correctLetter = answerLine.replace("Answer:", "").trim().charAt(0);
    const correctIndex = ["A", "B", "C", "D"].indexOf(correctLetter);
    const correctAnswer = correctIndex >= 0 ? options[correctIndex] : options[0];

    questions.push({
      question: questionLine,
      options,
      correctAnswer,
      explanation: explanationLine
        ? explanationLine.replace("Explanation:", "").trim()
        : "",
    });
  }
  return questions;
}

export default function MCQPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");
  const [rawText, setRawText] = useState("");

  const generateMCQs = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setError("");
    setLoading(true);
    setQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);

    try {
      const res = await axios.post("/api/generate", { topic: topic.trim(), mode: "mcq" });
      const text = res.data.result;
      setRawText(text);
      const parsed = parseMCQsFromText(text);
      if (parsed.length === 0) {
        setError("Could not parse MCQs. Try again or check raw output below.");
      }
      setQuestions(parsed);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate MCQs.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIdx, option) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError("");
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);
    setError("");
    setRawText("");
    setTopic("");
  };

  return (
    <Layout title="🎯 MCQ Generator & Evaluator">
      {/* Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateMCQs()}
            placeholder="Enter topic (e.g. Human Digestive System)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={generateMCQs}
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? "⏳ Generating..." : "🎯 Generate MCQs"}
          </button>
          {questions.length > 0 && (
            <button
              onClick={handleReset}
              className="border border-gray-200 text-gray-600 font-semibold px-4 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              🔄 Reset
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </div>

      {/* Score Banner */}
      {submitted && score !== null && (
        <div className={`rounded-2xl p-6 mb-6 text-center ${score >= questions.length * 0.8 ? "bg-green-50 border border-green-200" : score >= questions.length * 0.5 ? "bg-yellow-50 border border-yellow-200" : "bg-red-50 border border-red-200"}`}>
          <div className="text-5xl font-bold mb-2">
            {score}/{questions.length}
          </div>
          <p className="text-lg font-medium text-gray-700">
            Accuracy: {Math.round((score / questions.length) * 100)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {score === questions.length
              ? "🎉 Perfect score! Excellent!"
              : score >= questions.length * 0.8
              ? "🌟 Great job! Keep it up!"
              : score >= questions.length * 0.5
              ? "📚 Good effort! Review the explanations."
              : "💪 Keep practising! You've got this!"}
          </p>
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <div className="space-y-5">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="font-semibold text-gray-800 mb-4">
                <span className="text-blue-600 mr-2">Q{idx + 1}.</span>
                {q.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => {
                  let btnClass =
                    "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition ";
                  if (!submitted) {
                    btnClass +=
                      userAnswers[idx] === opt
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 border-gray-200 hover:border-blue-300";
                  } else {
                    if (opt === q.correctAnswer) {
                      btnClass += "bg-green-100 border-green-400 text-green-800 font-semibold";
                    } else if (userAnswers[idx] === opt && opt !== q.correctAnswer) {
                      btnClass += "bg-red-100 border-red-400 text-red-700";
                    } else {
                      btnClass += "bg-gray-50 border-gray-200 text-gray-500";
                    }
                  }
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswer(idx, opt)}
                      className={btnClass}
                    >
                      <span className="font-medium mr-2">{["A", "B", "C", "D"][oIdx]})</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <div className="mt-4 bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700">
                  <span className="font-semibold">💡 Explanation:</span> {q.explanation}
                </div>
              )}
            </div>
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition text-lg shadow"
            >
              ✅ Submit Answers ({Object.keys(userAnswers).length}/{questions.length} answered)
            </button>
          )}
        </div>
      )}

      {/* Raw text fallback */}
      {rawText && questions.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-semibold text-gray-500 mb-3">Raw Output:</p>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
            {rawText}
          </pre>
        </div>
      )}
    </Layout>
  );
}
