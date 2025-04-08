import mongoose from "mongoose";
export interface IChatGroup {
    _id: mongoose.Types.ObjectId,
    name: string,
    description?: string,
    picture?: string,
    members: string[],
    owners: string[],
    isPrivate: boolean,
    lastMessageAt: Date
}
const chatGroupSchema = new mongoose.Schema<IChatGroup>({
    _id: mongoose.SchemaTypes.ObjectId,
    name: { type: String, required: true }, // Name of the group
    description: { type: String },
    picture: String, // URI for picture
    members: [{ type: String, ref: 'User' }], // Array of User IDs who are members
    owners: [{ type: String, ref: 'User' }], // Array of User IDs who are owners
    isPrivate: { type: Boolean, default: true }, // Whether the group is private or public
    lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IChatGroup>('ChatGroup', chatGroupSchema)