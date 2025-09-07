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
<<<<<<< HEAD
=======
  howDidYouHearAboutUs?: string[];
}

interface TempCTFUser {
  email: string;
  otp: string;
  otpExpiresAt: Date;
>>>>>>> a29e407d43d279c5d96539332ecfacffc67ecf4e
}

export interface Registration extends Document {
  participant1: Participant;
  participant2?: Participant;
  participationType: "solo" | "duo";
<<<<<<< HEAD
  howDidYouHearAboutUs?: string[];
  agreeRules: boolean;
  consentLeaderboard: boolean;
  allowContact: boolean;
}

=======
}

export interface TempCTFUserDoc extends Document, TempCTFUser {}

>>>>>>> a29e407d43d279c5d96539332ecfacffc67ecf4e
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
<<<<<<< HEAD
=======
  howDidYouHearAboutUs: { type: String, required: false },
>>>>>>> a29e407d43d279c5d96539332ecfacffc67ecf4e
});

const participantSchema = new Schema<Participant>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
<<<<<<< HEAD
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
    required: true,
  },
=======
  gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], required: true },
>>>>>>> a29e407d43d279c5d96539332ecfacffc67ecf4e
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
<<<<<<< HEAD
  howDidYouHearAboutUs: { type: [String], required: false },
  agreeRules: { type: Boolean, required: true },
  consentLeaderboard: { type: Boolean, required: true },
  allowContact: { type: Boolean, required: true },
});

=======
});

const tempCTFUserSchema = new Schema<TempCTFUserDoc>({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
});

tempCTFUserSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

>>>>>>> a29e407d43d279c5d96539332ecfacffc67ecf4e
const CtfRegsModel =
  mongoose.models.ctfregs ||
  mongoose.model<Registration>("ctfregs", registrationSchema);

<<<<<<< HEAD
export default CtfRegsModel;
=======
const TempCTFUserModel =
  mongoose.models.tempctfusers ||
  mongoose.model<TempCTFUserDoc>("tempctfusers", tempCTFUserSchema);

export default CtfRegsModel;
export { TempCTFUserModel };
>>>>>>> a29e407d43d279c5d96539332ecfacffc67ecf4e
