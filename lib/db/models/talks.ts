import mongoose from "mongoose";

export interface Talk extends mongoose.Document {
  title: string;
  description: string;
  images: string[];
  type: "conference" | "talks" | "other";
  name: string;
  date: Date;
  speakers: string;
  speakerLinkedins?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TalkModel = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  type: {
    type: String,
    enum: ["conference", "talks", "other"],
    required: true,
  },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  speakers: { type: String, required: true },
  speakerLinkedins: { type: String, required: false },
  link :{type:String, required:false},
},
{
  timestamps: true
});

const TalkSchema = mongoose.models.Talk || mongoose.model("Talk", TalkModel);

export default TalkSchema;
