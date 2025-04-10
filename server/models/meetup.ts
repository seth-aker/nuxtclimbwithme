import mongoose, { Schema } from "mongoose";
import { IMeetupInvitation, meetupInvitationSchema } from "./MeetupInvitation";
export interface IMeetup {
    _id: mongoose.Types.ObjectId;
    organizerId: mongoose.Types.ObjectId; // Reference to User ID
    title: string;
    description?: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
      address?: string;
      gymId?: string; // Reference to Gym ID (optional)
      locationName?: string; // Store gym name if gymId is not used
    };
    dateTime: Date;
    capacity?: number;
    participants?: string[]; // Array of User IDs
    invitations?: IMeetupInvitation[];
    inviteOnly?: boolean;
    requiredExperience?: {
      boulderingGrade?: string;
      leadClimbingGrade?: string;
    };
    gearNeeded?: string[];
    status?: 'Open' | 'Full' | 'Cancelled' | 'Completed';
    createdAt?: Date;
    updatedAt?: Date;
}
const meetupSchema = new mongoose.Schema<IMeetup>({
    organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the user who created the meetup
    title: { type: String, required: true },
    description: { type: String },
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
        address: { type: String }, // Optional human-readable address
        gymId: { type: Schema.Types.ObjectId, ref: 'Gym' }, // Optional link to a specific gym
        locationName: { type: String }, // Store location name if gymId is not used
    },
    dateTime: { type: Date, required: true },
    capacity: { type: Number }, // Maximum number of participants
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs participating
    invitations: [meetupInvitationSchema],
    inviteOnly: { type: Boolean, default: false },
    requiredExperience: {
        boulderingGrade: { type: String },
        leadClimbingGrade: { type: String },
    },
    gearNeeded: [{ type: String }],
    status: { type: String, enum: ['Open', 'Full', 'Cancelled', 'Completed'], default: 'Open' },
}, { timestamps: true });

export default mongoose.model<IMeetup>('Meetup', meetupSchema)
