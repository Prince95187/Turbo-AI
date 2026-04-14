import mongoose from "mongoose";

const MCQSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    userAnswer: { type: String, default: null },
    isCorrect: { type: Boolean, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.MCQ || mongoose.model("MCQ", MCQSchema);
