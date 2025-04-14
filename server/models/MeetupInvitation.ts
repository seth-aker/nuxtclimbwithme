import mongoose, { Schema } from "mongoose"

export interface IMeetupInvitation {
  _id: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  meetupId: mongoose.Types.ObjectId
  status?: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Maybe';
  createdAt?: Date
  updatedAt?: Date
}

export const meetupInvitationSchema = new mongoose.Schema<IMeetupInvitation>({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    meetupId: { type: Schema.Types.ObjectId, ref: 'Meetup', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn', 'Maybe'], default: 'Pending' },
}, {timestamps: true});

