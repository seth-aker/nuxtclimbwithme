import mongoose, { Schema } from "mongoose";

export interface IConnectionRequest {
    _id: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId; // Refers to User ID
    receiverId: mongoose.Types.ObjectId; // Refers to User ID
    status?: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
    createdAt?: Date;
    updatedAt?: Date 
}
const connectionRequestSchema = new mongoose.Schema<IConnectionRequest>({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn'], default: 'Pending' },
}, {timestamps: true});

export default mongoose.model<IConnectionRequest>('ConnectionRequest', connectionRequestSchema);
