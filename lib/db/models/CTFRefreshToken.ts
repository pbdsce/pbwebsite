import mongoose from "mongoose";

const PBCTFRefreshTokenSchema = new mongoose.Schema({
  email : {type: String, required: true},
  tokenHash: {type: String, required: true},
  expiresAt: { type: Date, required: true},
}, {timestamps: true,}
);

export default mongoose.models.PBCTFRefreshToken || mongoose.model("PBCTFRefreshToken", PBCTFRefreshTokenSchema);