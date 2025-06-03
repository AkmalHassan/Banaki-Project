import mongoose from 'mongoose';

const QuestionOptionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  value: { type: String, required: true },
  text: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  key: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  type: { type: String, required: true },
  order_index: { type: Number, required: true },
  QuestionOptions: [QuestionOptionSchema],
});

export default mongoose.models.Question || 
       mongoose.model('Question', QuestionSchema);