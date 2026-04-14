import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function ProgressPage() {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProgress = async () => {
    if (!userId.trim()) {
      setError("Please enter your User ID.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(`/api/progress?userId=${encodeURIComponent(userId.trim())}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="📊 Progress Tracker">
      {/* User ID Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProgress()}
            placeholder="Enter your User ID (e.g. student123)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={fetchProgress}
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Loading..." : "📊 View Progress"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {data && (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-600 text-white rounded-2xl p-5 text-center">
              <div className="text-4xl font-bold">{data.overallAccuracy}%</div>
              <p className="text-blue-200 text-sm mt-1">Overall Accuracy</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="text-4xl font-bold text-gray-800">{data.records.length}</div>
              <p className="text-gray-400 text-sm mt-1">Total Attempts</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="text-4xl font-bold text-gray-800">{data.topicStats.length}</div>
              <p className="text-gray-400 text-sm mt-1">Topics Covered</p>
            </div>
          </div>

          {/* Topic Stats */}
          {data.topicStats.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📚 Topic Performance</h2>
              <div className="space-y-3">
                {data.topicStats.map(({ topic, attempts, accuracy }) => (
                  <div key={topic}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{topic}</span>
                      <span className={`font-semibold ${accuracy >= 70 ? "text-green-600" : accuracy >= 40 ? "text-yellow-600" : "text-red-500"}`}>
                        {accuracy}% ({attempts} {attempts === 1 ? "attempt" : "attempts"})
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${accuracy >= 70 ? "bg-green-500" : accuracy >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Weak topics */}
              {data.topicStats.some((t) => t.accuracy < 50) && (
                <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Weak Topics (below 50%)</p>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {data.topicStats
                      .filter((t) => t.accuracy < 50)
                      .map((t) => (
                        <li key={t.topic}>
                          {t.topic} — {t.accuracy}%
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recent Records */}
          {data.records.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">🕘 Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b">
                      <th className="pb-2 pr-4">Topic</th>
                      <th className="pb-2 pr-4">Score</th>
                      <th className="pb-2 pr-4">Accuracy</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.records.slice(0, 10).map((r) => (
                      <tr key={r._id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium text-gray-700">{r.topic}</td>
                        <td className="py-2 pr-4 text-gray-600">{r.score}/{r.total}</td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.accuracy >= 70 ? "bg-green-100 text-green-700" : r.accuracy >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            {r.accuracy}%
                          </span>
                        </td>
                        <td className="py-2 text-gray-400 text-xs">
                          {new Date(r.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.records.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p>No attempts yet. Start practising MCQs to track your progress!</p>
            </div>
          )}
        </>
      )}

      {!data && !loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📊</div>
          <p>Enter your User ID to view your progress</p>
        </div>
      )}
    </Layout>
  );
}
