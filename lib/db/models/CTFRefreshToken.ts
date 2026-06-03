import mongoose from "mongoose";

const PBCTFRefreshTokenSchema =
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  );

PBCTFRefreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default
  mongoose.models.PBCTFRefreshToken ||
  mongoose.model(
    "PBCTFRefreshToken",
    PBCTFRefreshTokenSchema
  );