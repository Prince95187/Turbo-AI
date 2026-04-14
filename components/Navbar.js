import Link from "next/link";
import { useRouter } from "next/router";

const navLinks = [
  { href: "/", label: "📝 Notes" },
  { href: "/mcq", label: "🎯 MCQs" },
  { href: "/chat", label: "🤖 AI Tutor" },
  { href: "/progress", label: "📊 Progress" },
  { href: "/leaderboard", label: "🏆 Leaderboard" },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition">
          ⚡ Turbo AI <span className="text-blue-300 text-lg font-medium">NEET</span>
        </Link>
        <ul className="flex flex-wrap gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  router.pathname === href
                    ? "bg-white text-blue-900"
                    : "hover:bg-blue-600 text-blue-100"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
