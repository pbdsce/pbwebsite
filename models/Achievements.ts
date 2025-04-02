import mongoose, { Document, Schema } from "mongoose";

// Define the Member interface
export interface Achievement extends Document {
  name: string;
  batch: string | null;
  email: string | null;
  portfolio: string | null;
  internship: string | null;
  companyPosition: string | null;
  achievements: string[];
  imageUrl: string | null;
}

// Create the schema for the Member model
const AchievementSchema: Schema<Achievement> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true
    },
    portfolio: {
      type: String,
      required: false
    },
    internship: {
      type:String,
      required: false,
    },
    companyPosition: {
      type: String,
      required: false,
    },
    achievements: {
      type: [String], // Array of strings
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
);

// Create a model from the schema
const AchievementModel = mongoose.models.achievements || mongoose.model<Achievement>("achievements", AchievementSchema);

export default AchievementModel;
