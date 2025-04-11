import mongoose, { Schema } from "mongoose";
export interface IMessageGroup {
    _id: mongoose.Types.ObjectId | string,
    name: string,
    description?: string,
    picture?: string,
    members: mongoose.Types.ObjectId[] | string[],
    owners: mongoose.Types.ObjectId[] | string[],
    isPrivate: boolean,
    lastMessageAt: Date,
    createdAt: Date | string,
    updatedAt: Date | string,
}
const messageGroupSchema = new mongoose.Schema<IMessageGroup>({
    name: { type: String, required: true }, // Name of the group
    description: { type: String },
    picture: String, // URI for picture
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of User IDs who are members
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of User IDs who are owners
    isPrivate: { type: Boolean, default: true }, // Whether the group is private or public
    lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IMessageGroup>('ChatGroup', messageGroupSchema)
