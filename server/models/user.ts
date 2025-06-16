import mongoose, { Schema, Types } from "mongoose"
export interface IClimbingDiscipline {
  name: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine',
  grade?: string,
  yearsExperience?: number,
  certified?: boolean,
}
export interface IBasicAddress {
  line1: string,
  line2?: string,
  city: string,
  state: string,
  zip: number
}

export interface IUserPublic {
    _id: Types.ObjectId;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    bio?: string;
    climbingExperience: {
      disciplines: IClimbingDiscipline[]
    };
    availability: {
      monday: ('Morning' | 'Afternoon' | 'Evening')[];
      tuesday: ('Morning' | 'Afternoon' | 'Evening')[];
      wednesday: ('Morning' | 'Afternoon' | 'Evening')[];
      thursday: ('Morning' | 'Afternoon' | 'Evening')[];
      friday: ('Morning' | 'Afternoon' | 'Evening')[];
      saturday: ('Morning' | 'Afternoon' | 'Evening')[];
      sunday: ('Morning' | 'Afternoon' | 'Evening')[];
    };
    preferences: {
      openToClimbingTypes?: {
        name: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine',
        preferredGrade?: string,
        certified?: boolean
      }[];
    };
    interests?: string[];
    gearOwned?: string[];
}

export interface IUserPrivate extends IUserPublic {
    authId: string
    email: string;
    phoneNumber?: string,
    location: {
      geoJSON?: {
        type: "Point",
        coordinates: number[]
      },
      locatedAt?: number | null,
      address?: IBasicAddress
    };
    preferences: {
      colorTheme: 'system' | 'light' | 'dark';
      openToClimbingTypes?: {
        name: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine',
        preferredGrade?: string,
        certified?: boolean
      }[];
      searchRadius?: number;
    };
    communitiesJoined: Types.ObjectId[]
    connections: Types.ObjectId[]; // Array of User IDs
    requestsSent:  Types.ObjectId[]; // Array of User IDs
    requestsReceived:  Types.ObjectId[]; // Array of User IDs
    blocked: Types.ObjectId[];
    registrationCompleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }

const userSchema = new mongoose.Schema<IUserPrivate>({
    authId: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    phoneNumber: {type: String, required: false, unique: true},
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String }, // URL or path to profile image
    bio: { type: String },
    location: {
        geoJSON: {
          type: { type: String, default: 'Point'},
          coordinates: {type: [Number], default: undefined},
        },
        locatedAt: Number,
        address: { 
          line1: String,
          line2: String,
          city: String,
          state: String,
          zip: String
         }, // Optional human-readable address
    },
    climbingExperience: {
        disciplines: [{
          name: { type: String, enum: ['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine'] },
          grade: { type: String },
          yearsExperience: { type: Number },
          certified: { type: Boolean } 
        }],
    },
    availability: {
      monday: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
      tuesday: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
      wednesday: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
      thursday: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
      friday: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
      saturday: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
      sunday: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }]
    },
    preferences: {
        colorTheme: { type: String, enum: ['system', 'light', 'dark'], default: 'system'},
        openToClimbingTypes: [{
          name: {type: String, enum: ['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']},
          preferredGrade: String,
          certified: Boolean
        }],
        searchRadius: { type: Number, default: 50 }, 
    },
    interests: [{ type: String }], // Other interests beyond climbing
    gearOwned: [{ type: String }], // List of climbing gear they own
    communitiesJoined: [{type: Schema.Types.ObjectId, ref: 'Community'}],
    connections: [{ type: Schema.Types.ObjectId, ref: 'User' }], // IDs of users they've connected with (optional)
    requestsSent: [{ type: Schema.Types.ObjectId, ref: 'ConnectionRequest' }], // IDs of users they've sent connection requests to
    requestsReceived: [{ type: Schema.Types.ObjectId, ref: 'ConnectionRequest' }], // IDs of users who have sent them connection requests
    blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    registrationCompleted: { type: Boolean, default: false }
    }, {timestamps: true});

export function trimPrivateFields(user: IUserPrivate): IUserPublic {
  const publicUser: IUserPublic = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
    bio: user.bio,
    climbingExperience: user.climbingExperience,
    availability: user.availability,
    preferences: {
      openToClimbingTypes: user.preferences.openToClimbingTypes
    },
    interests: user.interests,
    gearOwned: user.gearOwned,
  }
  return publicUser;
}

export default mongoose.model<IUserPrivate>('User', userSchema);

