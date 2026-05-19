import mongoose, { Schema, Document, Model } from "mongoose";

export interface User extends Document {
  name: string;
  githubUsername?: string;
  gitlabUsername?: string;
  gitlabId?: number;
  customOrgLinks?: string[];
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
}

const UserSchema = new Schema<User>(
  {
    name:            { type: String, required: true },
    githubUsername:  { type: String, default: null, index: true, sparse: true, unique: true },
    gitlabUsername:  { type: String, default: null, index: true, sparse: true, unique: true },
    gitlabId:        { type: Number, default: null },
    customOrgLinks:  { type: [String], default: [] },
    avatarUrl: { type: String, default: null },
  },
  { timestamps: true }
);

//UserSchema.index({ githubUsername: 1 }, { unique: true, sparse: true });
//UserSchema.index({ gitlabUsername: 1 }, { unique: true, sparse: true });

const User: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default User;