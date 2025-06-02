import mongoose from 'mongoose';

const QuestionOptionSchema = new mongoose.Schema({
  value: String,
  text: String
});

const QuestionSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  text: String,
  type: { type: String, enum: ['multiple_choice', 'text', 'date', 'multiple_select'] },
  order_index: Number,
  QuestionOptions: [QuestionOptionSchema]
});

export const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
