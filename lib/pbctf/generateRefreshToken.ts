import crypto from "crypto";
export default function generateRefreshToken() {
  return crypto.randomBytes(64)
  .toString("hex");
}