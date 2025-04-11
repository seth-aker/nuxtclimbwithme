import mongoose, { Schema } from "mongoose"

export interface IMeetupInvitation {
  _id: mongoose.Types.ObjectId | string
  senderId: mongoose.Types.ObjectId | string
  receiverId: mongoose.Types.ObjectId | string
  meetupId: mongoose.Types.ObjectId | string
  status?: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Maybe';
  createdAt?: Date | string
  updatedAt?: Date | string
}

export const meetupInvitationSchema = new mongoose.Schema<IMeetupInvitation>({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    meetupId: { type: Schema.Types.ObjectId, ref: 'Meetup', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn', 'Maybe'], default: 'Pending' },
}, {timestamps: true});

