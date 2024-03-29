import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Chat', ChatSchema);
