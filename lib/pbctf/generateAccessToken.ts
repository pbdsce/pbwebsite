import jwt from "jsonwebtoken";
export default function generateAccessToken(
  email: string) {
    return jwt.sign({email}, process.env.PBCTF_ACCESS_SECRET!, {expiresIn: "10min",});
  }

