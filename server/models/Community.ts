import mongoose, { Schema, Types } from "mongoose";
import { communityLocationSchema, ICommunityLocation } from "./communityLocation";
export interface ICommunity {
    _id: Types.ObjectId,
    location?: ICommunityLocation,
    name: string,
    description?: string,
    ownerIds: Types.ObjectId[],
    memberIds: Types.ObjectId[],
    website?: string,
    phone?: string,
    climbingTypes?: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine',
    createdAt?: Date,
    updatedAt?: Date
}
const communitySchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    location: communityLocationSchema,
    name: String,
    description: String,
    ownerIds: [{type: Schema.Types.ObjectId, ref: 'User'}],
    memberIds: [{type: Schema.Types.ObjectId, ref: 'User'}],
    website: String,
    phone: String,
    climbingTypes: {type: String, enum: ['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']},
}, {timestamps: true})

export default mongoose.model<ICommunity>('Community', communitySchema)