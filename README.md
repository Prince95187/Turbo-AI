# ⚡ Turbo AI — NEET Study Assistant

An AI-powered NEET exam preparation platform built with **Next.js**, **Tailwind CSS**, **OpenAI GPT**, and **MongoDB**.

## 🚀 Features

- 📝 **AI Notes Generator** — Generate comprehensive study notes for any NEET topic
- 🎯 **MCQ Generator & Evaluator** — Practice with AI-generated multiple-choice questions and get instant feedback
- 🤖 **AI Tutor Chat** — Ask doubts and get instant, accurate answers from your personal NEET AI tutor
- 📊 **Progress Tracker** — Track accuracy, identify weak topics, and monitor your growth
- 🏆 **Leaderboard** — Compete with other students and see top performers

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | Next.js 14, React 18, Tailwind CSS |
| Backend   | Next.js API Routes (Node.js)  |
| AI        | OpenAI GPT-4.1                |
| Database  | MongoDB + Mongoose            |
| Deployment| Vercel (frontend + API), MongoDB Atlas |

## 📦 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Prince95187/Turbo-AI.git
cd Turbo-AI
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=your_mongodb_connection_string
```

- Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
- Get a free MongoDB cluster from [cloud.mongodb.com](https://cloud.mongodb.com)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
turbo-ai/
├── pages/
│   ├── index.js          # Home — Notes Generator
│   ├── mcq.js            # MCQ Generator & Evaluator
│   ├── chat.js           # AI Tutor Chat
│   ├── progress.js       # Progress Tracking
│   ├── leaderboard.js    # Leaderboard
│   └── api/
│       ├── generate.js   # AI content generation (notes/mcq/revision)
│       ├── chat.js       # AI tutor chat endpoint
│       ├── mcq/
│       │   ├── save.js       # Save MCQ attempts
│       │   └── evaluate.js   # Evaluate & score MCQ answers
│       ├── progress/
│       │   └── index.js  # Fetch progress stats
│       └── leaderboard/
│           └── index.js  # Fetch leaderboard rankings
├── components/
│   ├── Layout.js         # Page layout wrapper
│   └── Navbar.js         # Navigation bar
├── lib/
│   ├── mongodb.js        # MongoDB connection utility
│   └── models/
│       ├── MCQ.js        # MCQ Mongoose schema
│       ├── Progress.js   # Progress Mongoose schema
│       └── Leaderboard.js # Leaderboard Mongoose schema
└── styles/
    └── globals.css       # Global styles + Tailwind
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables (`OPENAI_API_KEY`, `MONGODB_URI`) in Vercel dashboard
4. Deploy!

## 🗺️ Roadmap

- [ ] Firebase/JWT Authentication
- [ ] Adaptive difficulty based on performance
- [ ] Study planner & daily reminders
- [ ] Mock NEET full-length exams
- [ ] Weak topic auto-detection & recommendations
