import mongoose, {Schema, Types} from "mongoose";
export interface ICommunityLocation {
    _id: Types.ObjectId,
    name?: string,
    description?: string,
    coordinates?: {
        latitude: number,
        longitude: number
    },
    address?: string,
    geohash?: string,
    hours?: {
        openAtTime: string,
        openDurationHours: string,
    },
    navigationLinks: {
        uri: string,
        description?: string
    }[]
}
export const communityLocationSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    coordinates: {
        latitude: Number,
        longitude: Number,
    },
    address: { type: String },
    geohash: String,
    hours: {
        openAtTime: String,
        openDurationHours: Number
    },
    navigationLinks: [{
        uri: {type: String, required: true}, 
        description: String
    }],
})