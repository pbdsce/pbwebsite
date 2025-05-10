import mongoose, { Document, Schema } from "mongoose";

// Define the Achievement interface
export interface Lead extends Document {
    id:string;
    name: string;
    position: string;
    organization: string;
    additionalInfo: string;
    imageUrl: string; 
}

const Leadschema: Schema<Lead> = new Schema({
  id:{
    type:String,
    required:true,
    unique:true,
  },
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: false,
  },
  additionalInfo: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Leadsmodel = mongoose.models.leads || mongoose.model<Lead>("leads", Leadschema);

export default Leadsmodel;
