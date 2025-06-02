import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const QuestionOptionSchema = new mongoose.Schema({
  value: String,
  text: String
});

const QuestionSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  text: String,
  type: {
    type: String,
    enum: ['multiple_choice', 'text', 'date', 'multiple_select']
  },
  order_index: Number,
  options: [QuestionOptionSchema]
});

const AnswerSchema = new mongoose.Schema({
  questionKey: String,
  value: mongoose.Schema.Types.Mixed,
  sessionId: mongoose.Schema.Types.ObjectId
});

const SessionSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now }
});

export const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
export const Answer = mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
