import mongoose, { Schema } from "mongoose"

export interface IUser {
    _id: mongoose.Types.ObjectId;
    authId: string
    email: string;
    phoneNumber?: string,
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    bio?: string;
    location: {
      coordinates?: {
        latitude: number,
        longitude: number,
      },
      geohash?: string
      address?: string;
    };
    climbingExperience: {
      disciplines: {
        name: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine',
        grade?: string,
        yearsExperience?: number,
        certified?: boolean
      }[]
    };
    availability: {
      weekdays?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
      timeOfDay?: ('Morning' | 'Afternoon' | 'Evening')[];
    }[];
    preferences: {
      colorTheme?: 'System' | 'Light' | 'Dark';
      preferredClimbingTypes?: {
        name: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine',
        preferredGrade?: string,
        certified?: boolean
      }[];
      searchRadius?: number;
    };
    interests?: string[];
    gearOwned?: string[];
    connections: mongoose.Types.ObjectId[]; // Array of User IDs
    requestsSent:  mongoose.Types.ObjectId[]; // Array of User IDs
    requestsReceived:  mongoose.Types.ObjectId[]; // Array of User IDs
    blocked: mongoose.Types.ObjectId[];
    registrationCompleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }

const userSchema = new mongoose.Schema<IUser>({
    authId: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    phoneNumber: {type: String, required: false, unique: true},
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String }, // URL or path to profile image
    bio: { type: String },
    location: {
        coordinates: {
           latitude: Number,
           longitude: Number,
        },
        geohash: String,
        address: { type: String }, // Optional human-readable address
    },
    climbingExperience: {
        disciplines: [{
          name: { type: String, enum: ['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine'] },
          grade: { type: String },
          yearsExperience: { type: Number },
          certified: { type: Boolean } 
        }],
    },
    availability: [{
        weekdays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
        timeOfDay: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
    }],
    preferences: {
        colorTheme: { type: String, enum: ['System', 'Light', 'Dark'], default: 'System'},
        preferredClimbingTypes: [{
          name: {type: String, enum: ['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']},
          preferredGrade: String,
          certified: Boolean
        }],
        searchRadius: { type: Number, default: 50 }, 
    },
    interests: [{ type: String }], // Other interests beyond climbing
    gearOwned: [{ type: String }], // List of climbing gear they own
    connections: [{ type: Schema.Types.ObjectId, ref: 'User' }], // IDs of users they've connected with (optional)
    requestsSent: [{ type: Schema.Types.ObjectId, ref: 'ConnectionRequest' }], // IDs of users they've sent connection requests to
    requestsReceived: [{ type: Schema.Types.ObjectId, ref: 'ConnectionRequest' }], // IDs of users who have sent them connection requests
    blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    registrationCompleted: { type: Boolean, default: false }
    }, {timestamps: true});

export default mongoose.model<IUser>('User', userSchema);

