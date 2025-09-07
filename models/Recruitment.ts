import mongoose, { Schema, Document } from "mongoose";

export interface RecruitmentData {
  name: string;
  email: string;
  whatsapp_number: string;
  college_id: string;
  year_of_study: string;
  branch: string;
  about: string;
}

export interface TempRecruitmentUser {
  email: string;
  otp: string;
  otpExpiresAt: Date;
}

export interface RecruitmentDoc extends Document, RecruitmentData {}

export interface TempRecruitmentUserDoc extends Document, TempRecruitmentUser {}

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
      enum: ["1st year", "2nd year", "3rd year", "4th year"],
    },
    branch: {
      type: String,
      required: true,
      enum: [
        "Artificial Intelligence and Machine Learning",
        "Aeronautical Engineering",
        "Automobile Engineering",
        "Biotechnology",
        "Computer Science and Engineering",
        "Computer Science and Business Systems",
        "Computer Science & Engineering (Cyber Security)",
        "Computer Science & Engineering (Data Science)",
        "Computer Science & Engineering (Internet of Things and Cyber Security Including Block Chain Technology)",
        "Computer Science and Design",
        "Chemical Engineering",
        "Civil Engineering",
        "Electrical & Electronics Engineering",
        "Electronics & Communication Engineering",
        "Electronics and Instrumentation Engineering",
        "Electronics and Telecommunication Engineering",
        "Information Science and Engineering",
        "Mechanical Engineering",
        "Medical Electronics Engineering",
        "Robotics and Artificial Intelligence",
      ],
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
recruitmentSchema.pre("validate", function (next) {
  const year = this.year_of_study;
  const collegeId = this.college_id;

  if (year === "1st year") {
    const admissionNumberRegex = /^[1-9][0-9][A-Z]{4}[0-9]{4}$/;
    if (!admissionNumberRegex.test(collegeId)) {
      return next(
        new Error(
          "Invalid Admission Number format for 1st year. Expected format: 19ABCD1234"
        )
      );
    }
  } else {
    const usnRegex = /^[1][D][S][1-3][0-9][A-Z]{2}[0-9]{3}$/;
    if (!usnRegex.test(collegeId)) {
      return next(
        new Error(
          "Invalid USN format for 2nd/3rd/4th year. Expected format: 1DS21CS123"
        )
      );
    }
  }

  next();
});

const tempRecruitmentUserSchema = new Schema<TempRecruitmentUserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tempRecruitmentUserSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

const RecruitmentModel =
  mongoose.models.recruitment2025 ||
  mongoose.model<RecruitmentDoc>("recruitment2025", recruitmentSchema);

const TempRecruitmentUserModel =
  mongoose.models.temprecruitment2025 ||
  mongoose.model<TempRecruitmentUserDoc>(
    "temprecruitment2025",
    tempRecruitmentUserSchema
  );

export default RecruitmentModel;
export { TempRecruitmentUserModel };
