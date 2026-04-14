import Navbar from "./Navbar";

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {title && (
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        )}
        {children}
      </main>
      <footer className="text-center text-gray-400 text-sm py-6 border-t mt-10">
        ⚡ Turbo AI NEET &mdash; Built to help you crack NEET 🚀
      </footer>
    </div>
  );
}
