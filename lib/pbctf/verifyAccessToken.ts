import jwt from "jsonwebtoken";

interface AccessTokenPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export default function verifyAccessToken(
  token: string
): AccessTokenPayload | false {
  try {
    const decoded = jwt.verify(
      token,
      process.env.PBCTF_ACCESS_SECRET!
    ) as AccessTokenPayload;

    return decoded;
  } catch (error) {
    console.error(
      "Access token verification failed:",
      error
    );

    return false;
  }
}