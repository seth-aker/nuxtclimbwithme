import mongoose, { Schema } from "mongoose";
export interface IChatMessage {
    _id: mongoose.Types.ObjectId;
    groupId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId; // Refers to User ID
    content: string;
    timestamp?: Date;
    readBy: [mongoose.Types.ObjectId];
  }
const chatMessageSchema = new mongoose.Schema<IChatMessage>({
    groupId: { type: Schema.Types.ObjectId, ref: 'ChatGroup', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
