import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "LMS data");

export default User;

/* 
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
    clerkId: string; 
    email: string; 
    firstName: string; 
    lastName: string; 
    imageUrl: string; 
    createdAt: Date; 
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String }
}, { timestamps: true });

// Change 'desired_collection_name' to your target collection
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema, 'desired_collection_name');

export default User;
*/
