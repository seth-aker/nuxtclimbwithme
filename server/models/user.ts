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
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
      address?: string;
    };
    climbingExperience: {
      boulderingGrade?: string;
      leadClimbingGrade?: string;
      topRopingGrade?: string;
      yearsClimbing?: number;
      disciplines?: ('Bouldering' | 'Sport' | 'Trad' | 'Aid' | 'Ice' | 'Alpine')[];
    };
    availability: {
      weekdays?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
      timeOfDay?: ('Morning' | 'Afternoon' | 'Evening')[];
    };
    preferences: {
      colorTheme?: 'System' | 'Light' | 'Dark';
      preferredClimbingTypes?: ('Bouldering' | 'Sport' | 'Trad')[];
      preferredGrades?: {
        bouldering?: string;
        lead?: string;
      };
      willingToTravel?: boolean;
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
        type: {
            type: String, // Don't do `{ type: String }` here
            enum: ['Point'], // 'Point' is the only allowed type for GeoJSON Point
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere', // For geospatial queries,
            default: []
        },
        address: { type: String }, // Optional human-readable address
    },
    climbingExperience: {
        boulderingGrade: { type: String }, // e.g., "V4", "6B"
        leadClimbingGrade: { type: String }, // e.g., "5.10a", "6a+"
        topRopingGrade: { type: String }, // e.g., "5.9"
        yearsClimbing: { type: Number },
        disciplines: [{ type: String, enum: ['Bouldering', 'Sport', 'Trad', 'Aid', 'Ice', 'Alpine'] }],
    },
    availability: {
        weekdays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
        timeOfDay: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
    },
    preferences: {
        colorTheme: { type: String, enum: ['System', 'Light', 'Dark'], default: 'System'},
        preferredClimbingTypes: [{ type: String, enum: ['Bouldering', 'Sport', 'Trad'] }],
        preferredGrades: {
            bouldering: { type: String },
            lead: { type: String },
        },
        willingToTravel: { type: Boolean, default: false },
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

