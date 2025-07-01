import mongoose, { Schema, Document } from "mongoose";

interface Participant {
  name: string;
  email: string;
  usn: string;
  year: string;
  phone: string;
  branch: string;   
  college: string; 
}

export interface Registration extends Document {
  participant1: Participant;
  participant2?: Participant;
  participationType: "solo" | "duo";
}

const participantSchema = new Schema<Participant>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  usn: { type: String, required: true },
  year: { type: String, required: true },
  phone: { type: String, required: true },
  branch: { type: String, required: true },
  college: { type: String, required: true },
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
