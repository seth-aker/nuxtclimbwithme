import mongoose, { Schema } from "mongoose";
export interface IMessage {
    _id: mongoose.Types.ObjectId | string;
    groupId: mongoose.Types.ObjectId | string;
    senderId: mongoose.Types.ObjectId | string; // Refers to User ID
    content: string;
    timestamp?: Date | string;
    readBy: mongoose.Types.ObjectId[] | string[];
  }
const messageSchema = new mongoose.Schema<IMessage>({
    groupId: { type: Schema.Types.ObjectId, ref: 'ChatGroup', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
export default mongoose.model<IMessage>('ChatMessage', messageSchema);
