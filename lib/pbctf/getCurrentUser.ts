import { cookies } from "next/headers";
import connectDB from "@/lib/db/connection";
import CtfRegsModel from "@/lib/db/models/CTFRegs";
import verifyAccessToken from "./verifyAccessToken";

export default async function getCurrentUser() {
  await connectDB();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("pbctf_access")?.value;

  if (!accessToken) {
    return null;
  }

  const decoded = verifyAccessToken(accessToken);

  if (!decoded) {
    return null;
  }

  const registration = await CtfRegsModel.findOne({
      $or: [
        { "participant1.email": decoded.email,},
        { "participant2.email": decoded.email,},
      ],
    });

  if (!registration) {
    return null;
  }

  const isLeader = registration.participant1.email === decoded.email;

  return {
    email: decoded.email,
    isLeader,
    registration,
  };
}