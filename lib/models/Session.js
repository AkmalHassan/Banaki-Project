import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() }
}, { _id: false });

export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
