import mongoose from "mongoose";

interface Lore extends mongoose.Document {
  id: string | null;
  title: string;
  date: Date;
  location: string;
  preview: string;
  story: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LoreModel = new mongoose.Schema({
  id: { type: String, default: null },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  preview: { type: String, required: true },
  story: { type: [String], required: true },
  images: { type: [String], required: true },
},
{
  timestamps: true
}
);

const Lore = mongoose.models.Lore || mongoose.model("Lore", LoreModel);

export default Lore;
