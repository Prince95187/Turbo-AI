import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/leaderboard");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="🏆 Leaderboard">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">Top 20 students ranked by total score</p>
        <button
          onClick={fetchLeaderboard}
          className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg transition"
        >
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="animate-spin text-4xl mb-3">⏳</div>
          <p>Loading leaderboard...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {data && data.leaderboard.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🏆</div>
          <p>No entries yet. Be the first to appear on the leaderboard!</p>
          <p className="text-sm mt-1">Complete MCQ quizzes to earn points.</p>
        </div>
      )}

      {data && data.leaderboard.length > 0 && (
        <>
          {/* Top 3 Podium */}
          {data.leaderboard.length >= 3 && (
            <div className="flex justify-center items-end gap-4 mb-8">
              {[1, 0, 2].map((idx) => {
                const entry = data.leaderboard[idx];
                if (!entry) return null;
                const heights = ["h-28", "h-36", "h-24"];
                const colors = ["bg-yellow-400", "bg-blue-500", "bg-orange-400"];
                return (
                  <div key={entry.userId} className="flex flex-col items-center">
                    <span className="text-2xl mb-1">{MEDALS[idx]}</span>
                    <span className="font-semibold text-gray-800 text-sm mb-2 truncate max-w-24 text-center">
                      {entry.username}
                    </span>
                    <div
                      className={`w-20 ${heights[idx === 0 ? 0 : idx === 1 ? 1 : 2]} ${colors[idx === 0 ? 0 : idx === 1 ? 1 : 2]} rounded-t-xl flex items-center justify-center text-white font-bold`}
                    >
                      {entry.totalScore}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Attempts</th>
                  <th className="px-5 py-3">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard.map((entry) => (
                  <tr
                    key={entry.userId}
                    className="border-t border-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="px-5 py-4 font-bold text-gray-500">
                      {entry.rank <= 3 ? (
                        <span className="text-xl">{MEDALS[entry.rank - 1]}</span>
                      ) : (
                        `#${entry.rank}`
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {entry.username}
                    </td>
                    <td className="px-5 py-4 text-blue-700 font-bold">
                      {entry.totalScore}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{entry.totalAttempts}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          entry.accuracy >= 70
                            ? "bg-green-100 text-green-700"
                            : entry.accuracy >= 40
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {entry.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}
