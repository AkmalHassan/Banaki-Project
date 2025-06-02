import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionKey: String,
  value: String,
  sessionId: String
});

export const Answer = mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
