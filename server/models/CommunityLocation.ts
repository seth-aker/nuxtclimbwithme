import mongoose, {Schema, Types} from "mongoose";
export interface ICommunityLocation {
    _id: Types.ObjectId,
    name?: string,
    description?: string,
    geoJSON?: {
        type: 'Point',
        coordinates: [number, number]
    }
    address?: string,
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
    geoJSON: {
        type: {type: String, default: 'Point', immutable: true},
        coordinates: [Number, Number]
    },
    address: { type: String },
    hours: {
        openAtTime: String,
        openDurationHours: Number
    },
    navigationLinks: [{
        uri: {type: String, required: true}, 
        description: String
    }],
})