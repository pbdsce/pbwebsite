import mongoose, { Schema, Document } from "mongoose";
import { branches, years } from "@/lib/constants/dropdownOptions";

export interface RecruitmentData {
  name: string;
  email: string;
  whatsapp_number: string;
  college_id: string;
  year_of_study: string;
  branch: string;
  about: string;
}

export interface RecruitmentDoc extends Document, RecruitmentData { }

const recruitmentSchema = new Schema<RecruitmentDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    whatsapp_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit phone number"],
    },
    college_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    year_of_study: {
      type: String,
      required: true,
      enum: years,
    },
    branch: {
      type: String,
      required: true,
      enum: branches,
    },
    about: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1500,
    },
  },
  {
    timestamps: true,
  }
);

// validate college_id based on year of study
recruitmentSchema.pre("validate", function () {
  const year = this.year_of_study;
  const collegeId = this.college_id;

  if (year === "1st year") {
    const admissionNumberRegex = /^[1-9][0-9][A-Z]{4}[0-9]{4}$/;
    if (!admissionNumberRegex.test(collegeId)) {
      this.invalidate(
        "college_id",
        "Invalid Admission Number format for 1st year. Expected format: 19ABCD1234"
      );
    }
  } else {
    const usnRegex = /^[1][D][S][1-3][0-9][A-Z]{2}[0-9]{3}$/;
    if (!usnRegex.test(collegeId)) {
      this.invalidate(
        "college_id",
        "Invalid USN format for 2nd/3rd/4th year. Expected format: 1DS21CS123"
      );
    }
  }
});

function getRecruitmentModel() {
  return (
    (mongoose.models.recruitment2026 as mongoose.Model<RecruitmentDoc>) ||
    mongoose.model<RecruitmentDoc>(
      "recruitment2026",
      recruitmentSchema,
      "recruitment2026"
    )
  );
}

const RecruitmentModel = getRecruitmentModel();

export default RecruitmentModel;
