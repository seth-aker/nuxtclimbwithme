import mongoose, { Schema } from "mongoose";

export interface IConnectionRequest {
    _id: mongoose.Types.ObjectId | string;
    senderId: mongoose.Types.ObjectId | string; // Refers to User ID
    receiverId: mongoose.Types.ObjectId | string; // Refers to User ID
    status?: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
const connectionRequestSchema = new mongoose.Schema<IConnectionRequest>({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn'], default: 'Pending' },
}, {timestamps: true});

export default mongoose.model<IConnectionRequest>('ConnectionRequest', connectionRequestSchema)