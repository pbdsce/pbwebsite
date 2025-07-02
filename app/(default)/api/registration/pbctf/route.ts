import connectMongoDB from "@/lib/dbConnect";
import { ratelimiter } from "@/lib/ratelimiter";
import CtfRegsModel from "@/models/CTFRegs";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: Check if a USN is registered
 *     description: This endpoint checks if the provided USN is already registered for a participant.
 *     tags:
 *      - Registration
 *     parameters:
 *       - in: query
 *         name: usn
 *         required: true
 *         schema:
 *           type: string
 *           description: The USN of the participant.
 *     responses:
 *       200:
 *         description: The USN is either not registered or already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "usn already exists"
 *                 isUnique:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Missing USN parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "usn is required"
 *       500:
 *         description: Internal server error while fetching data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */
//Check if USN exists
export async function GET(request: Request) {
  await connectMongoDB();
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (identifier && emailRegex.test(identifier)) {
      const existing = await CtfRegsModel.findOne({
        $or: [
          { "participant1.email": identifier },
          { "participant2.email": identifier },
        ],
      });
      if (existing) {
        return NextResponse.json(
          { message: "email already exists", isUnique: false },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "email not registered", isUnique: true },
        { status: 403 }
      );
    } else {
      const existing = await CtfRegsModel.findOne({
        $or: [
          { "participant1.phone": identifier },
          { "participant2.phone": identifier },
        ],
      });
      if (existing) {
        return NextResponse.json(
          { message: "phone already exists", isUnique: false },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "phone not registered", isUnique: true },
        { status: 403 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      return NextResponse.json(
        { error: "An error occurred", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Handle registration actions
 *     description: This endpoint handles different registration actions like reCAPTCHA validation or adding a registration.
 *     tags:
 *      - Registration
 *     parameters:
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           description: Action to perform (validateRecaptcha, addRegistration)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recaptcha_token:
 *                 type: string
 *                 description: The reCAPTCHA token for validation.
 *     responses:
 *       200:
 *         description: Successful operation based on action.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recaptcha validated!"
 *       400:
 *         description: Invalid action specified or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid action specified"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
 
    const { success } = await ratelimiter.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url); // Extract query parameters
    const action = searchParams.get("action"); // Determine the action from query params

    if (action === "validateRecaptcha") {
      return validateRecaptcha(request);
    } else if (action === "addRegistration") {
      return addRegistration(request);
    } else {
      return NextResponse.json(
        { error: "Invalid action specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred", details: error },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/registrations/validateRecaptcha:
 *   post:
 *     summary: Validate reCAPTCHA token
 *     description: This endpoint validates the reCAPTCHA token to verify if the user is human.
 *     tags:
 *      - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recaptcha_token:
 *                 type: string
 *                 description: The reCAPTCHA token for validation.
 *     responses:
 *       200:
 *         description: reCAPTCHA validated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recaptcha validated!"
 *       500:
 *         description: reCAPTCHA validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "reCAPTCHA validation failed"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad Request when reCAPTCHA token is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "reCAPTCHA token not found! Try again"
 */
// Add a new registration
async function validateRecaptcha(request: Request) {
  const formData = await request.json();
  const { recaptcha_token } = formData;

  const recaptchaToken = recaptcha_token;

  const details = {
    event: {
      token: recaptchaToken,
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    },
  };

  if (!recaptchaToken) {
    return NextResponse.json(
      {
        message: "reCAPTCHA token not found! Try again",
        error: "reCAPTCHA token not found!",
      },
      {
        status: 500,
      }
    );
  }

  // Verify the reCATPTCHA token

  const recaptchaResponse = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify(details),
    }
  );

  const recaptchaResult = await recaptchaResponse.json();
  if (recaptchaResult.riskAnalysis.score < 0.7) {
    return NextResponse.json({
      message: "reCAPTCHA validation failed",
      error: recaptchaResult["error-codes"],
    });
  }

  // Return a response
  return NextResponse.json({ message: "Recaptcha validated!" });
}
/**
 * @swagger
 * /api/registrations/addRegistration:
 *   post:
 *     summary: Add a new registration
 *     description: This endpoint allows users to register for the event.
 *     tags:
 *      - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant1:
 *                 type: object
 *                 properties:
 *                   usn:
 *                     type: string
 *                     description: The USN of participant 1.
 *               participationType:
 *                 type: string
 *                 description: Type of participation.
 *     responses:
 *       200:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful!"
 *       400:
 *         description: Invalid data, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid data. Participant1 and participationType are required."
 */
async function addRegistration(request: Request) {
  try {
    const data = await request.json();
    if (!data || !data.participant1 || !data.participationType) {
      return NextResponse.json(
        {
          error:
            "Invalid data. Participant1 and participationType are required.",
        },
        { status: 400 }
      );
    }

    const transformParticipant = (p: any) => {
      if (!p) return undefined;

      return {
        name: p.name,
        email: p.email,
        age: parseInt(p.age),
        phone: p.phone,
        gender: p.gender,
        background: {
          experienceLevel: p.experienceLevel,
          previousParticipation: p.previousCTF === "Yes",
          participationDetails:
            p.previousCTF === "Yes" ? p.ctfNames : undefined,
          affiliationType: p.affiliation,
          affiliationName: p.affiliationName,
          howDidYouHearAboutUs: p.howDidYouHear,
        },
      };
    };

    const registrationData = {
      participant1: transformParticipant(data.participant1),
      participant2:
        data.participationType === "duo"
          ? transformParticipant(data.participant2)
          : undefined,
      participationType: data.participationType,
    };

    const newDoc = new CtfRegsModel(registrationData);
    await newDoc.save();
    return NextResponse.json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error adding registration:", error);
    return NextResponse.json(
      { error: "Failed to add registration.", details: error },
      { status: 500 }
    );
  }
}
