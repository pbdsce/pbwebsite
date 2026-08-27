import mongoose from "mongoose";

export interface Events extends mongoose.Document {
  id: string;
  eventName: string;
  description: string;
  eventDate: string;
  lastDateOfRegistration: string;
  imageURL: string;
  registrationLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const Eventschema: mongoose.Schema<Events> = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  lastDateOfRegistration: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  registrationLink: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true
  }
);

const EventModel =
  mongoose.models.Events || mongoose.model<Events>("Events", Eventschema);
export default EventModel;
