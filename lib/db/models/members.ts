import mongoose from "mongoose";

export interface Members extends mongoose.Document {
  name: string;
  linkedInUrl?: string;
  role: string;
  imageUrl?: string;
  year: "first" | "second" | "third" | "fourth" | "alumni";
  company?: string;
  tags?: "lead" | "alumni-lead";
  leadDesc?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MembersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  linkedInUrl: { type: String, required: false },
  role: { type: String, required: true },
  imageUrl: { type: String, required: false },
  company: { type: String, required: false },
  year: {
    type: String,
    enum: ["first", "second", "third", "fourth", "alumni"],
    required: true,
  },
  tags: { type: String, enum: ["lead", "alumni-lead"], required: false },
  leadDesc: { type: String, required: false },
},
{ timestamps: true });

const MembersModel =
  mongoose.models.Members || mongoose.model("Members", MembersSchema);

export default MembersModel;
