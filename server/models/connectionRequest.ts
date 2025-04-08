import mongoose from "mongoose";

export interface IConnectionRequest {
    _id: mongoose.Types.ObjectId;
    senderId: string; // Refers to User ID
    receiverId: string; // Refers to User ID
    status?: 'Pending' | 'Accepted' | 'Rejected';
    createdAt?: Date;
    updatedAt?: Date;
}
const connectionRequestSchema = new mongoose.Schema<IConnectionRequest>({
    _id: mongoose.Types.ObjectId,
    senderId: { type: String, ref: 'User', required: true },
    receiverId: { type: String, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
}, {timestamps: true});

export default mongoose.model<IConnectionRequest>('ConnectionRequest', connectionRequestSchema)