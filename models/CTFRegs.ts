import mongoose, { Schema, Document } from "mongoose";

interface Participant {
  name: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  phone: string;
  background: Background;
}

interface Background {
  experienceLevel: "Beginner" | "Intermediate" | "Advanced";
  previousParticipation: boolean;
  participationDetails?: string;
  affiliationType: "Student" | "Professional" | "Hobbyist";
  affiliationName: string;
  howDidYouHearAboutUs?: string[];
}




export interface Registration extends Document {
  participant1: Participant;
  participant2?: Participant;
  participationType: "solo" | "duo";
}

const backgroundSchema = new Schema({
  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
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
    enum: ["Student", "Professional", "Hobbyist"],
    required: true,
  },
  affiliationName: { type: String, required: true },
  howDidYouHearAboutUs: { type: String, required: false },
});

const participantSchema = new Schema<Participant>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], required: true },
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
