import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const MODES = [
  { value: "notes", label: "📝 Notes", desc: "Comprehensive study notes" },
  { value: "mcq", label: "🎯 MCQs", desc: "5 practice questions" },
  { value: "revision", label: "⚡ Revision", desc: "Quick revision sheet" },
];

const POPULAR_TOPICS = [
  "Cell Biology",
  "Human Digestive System",
  "Photosynthesis",
  "Newton's Laws",
  "Periodic Table",
  "Chemical Bonding",
  "Genetics & Heredity",
  "Human Heart",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("notes");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");

    try {
      const res = await axios.post("/api/generate", { topic: topic.trim(), mode });
      setOutput(res.data.result);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="⚡ Turbo AI — NEET Study Assistant">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-5">
          {/* Topic Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📚 Enter Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. Photosynthesis, Newton's Laws..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {/* Popular topics */}
            <p className="text-xs text-gray-400 mt-3 mb-2">Popular topics:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded-lg transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎛️ Select Mode
            </label>
            <div className="space-y-2">
              {MODES.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                    mode === value
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-gray-50 text-gray-700 border-gray-100 hover:border-blue-200"
                  }`}
                >
                  <span className="font-medium">{label}</span>
                  <span className={`block text-xs mt-0.5 ${mode === value ? "text-blue-200" : "text-gray-400"}`}>
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition disabled:opacity-60 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating...
              </span>
            ) : (
              "🚀 Generate"
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-96">
            {output ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {MODES.find((m) => m.value === mode)?.label} — {topic}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1 rounded-lg transition"
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                  {output}
                </pre>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center text-gray-400">
                <div className="text-6xl mb-4">🧠</div>
                <p className="text-lg font-medium">Your content will appear here</p>
                <p className="text-sm mt-1">Choose a topic and mode, then hit Generate!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
