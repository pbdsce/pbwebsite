import mongoose, { Schema, Document } from "mongoose";

interface Participant {
  name: string;
  email: string;
  age: number;
  gender: Gender;
  phone: string;
  background: Background;
}

interface Background {
  experRienceLevel: Experience;
  previousParticipation: boolean;
  participationDetails?: string;
  affiliationType: Affiliation;
  affiliationName: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
  PreferNotToSay = "prefer_not_to_say",
}

export enum Experience {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export enum Affiliation {
  Student = "student",
  Professional = "professional",
  Hobbyist = "hobbyist",
}

export interface Registration extends Document {
  participant1: Participant;
  participant2?: Participant;
  participationType: "solo" | "duo";
}

const backgroundSchema = new Schema({
  experRienceLevel: {
    type: String,
    enum: Object.values(Experience),
    required: true,
  },
  previousParticipation: { type: Boolean, required: true },
  participationDetails: {
    type: String,
    required: function (this: Background) {
      return this.previousParticipation === true;
    },
  },
  affiliationType: {
    type: String,
    enum: Object.values(Affiliation),
    required: true,
  },
  affiliationName: { type: String, required: true },
});

const participantSchema = new Schema<Participant>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: Object.values(Gender), required: true },
  background: { type: backgroundSchema, required: true },
  phone: { type: String, required: true },
});

const registrationSchema = new Schema<Registration>({
  participant1: { type: participantSchema, required: true },
  participant2: {
    type: participantSchema,
    required: function (this: Registration) {
      return this.participationType === "duo";
    },
  },

  participationType: {
    type: String,
    enum: ["solo", "duo"],
    required: true,
  },
});

const CtfRegsModel =
  mongoose.models.ctfregs ||
  mongoose.model<Registration>("ctfregs", registrationSchema);

export default CtfRegsModel;
