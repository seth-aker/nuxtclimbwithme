import mongoose from "mongoose";
export interface IGym {
    gymId: string;
    name: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    website?: string;
    navigationUri?: string,
    phone?: string;
    amenities?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
const gymSchema = new mongoose.Schema<IGym>({
    gymId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    website: { type: String },
    navigationUri: { type: String },
    phone: { type: String },
    amenities: [{ type: String }], // e.g., "rope climbing", "bouldering", "training area"
}, {timestamps: true});

export default mongoose.model<IGym>('Gym', gymSchema);