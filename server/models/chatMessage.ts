import mongoose from "mongoose";
export interface IChatMessage {
    _id: mongoose.Types.ObjectId;
    groupId: string;
    senderId: string; // Refers to User ID
    content: string;
    timestamp?: Date;
    readBy: boolean;
  }
const chatMessageSchema = new mongoose.Schema<IChatMessage>({
    _id: mongoose.SchemaTypes.ObjectId,
    groupId: { type: String, ref: 'ChatGroup', required: true },
    senderId: { type: String, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: String, ref: 'User' }],
});
export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
