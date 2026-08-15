import mongoose from "mongoose";

interface Achievement {
  title: string;
  description?: string;
}

export interface Achievements extends mongoose.Document {
  name: string;
  imageUrl?: string;

  achivements: {
    GSoC?: Achievement[];
    LFX?: Achievement[];
    SIH?: Achievement[];
    LIFT?: Achievement[];
    Hackathons?: Achievement[];
    CP?: Achievement[];
    ACM?: Achievement[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const AchievementsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
  achivements: {
    GSoC: [
      {
        title: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
    LFX: [
      {
        title: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
    SIH: [
      {
        title: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
    LIFT: [
      {
        title: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
    Hackathons: [
      {
        title: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
    CP: [
      {
        title: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
    ACM: [
      {
        title: { type: String, required: true },
        description: { type: String, required: false },
      },
    ],
  },
},
{ timestamps: true }
);

const AchievementsModel =
  mongoose.models.Achievements ||
  mongoose.model<Achievements>("Achievements", AchievementsSchema);

export default AchievementsModel;
