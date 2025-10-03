import connectMongoDB from "@/lib/dbConnect";
import { ratelimiter } from "@/lib/ratelimiter";
import RecruitmentModel from "@/models/Recruitment";
import { TempRecruitmentUserModel } from "@/models/Recruitment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email rotation system - 20 PointBlank email accounts
const EMAIL_ACCOUNTS = [
  "rahul@pointblank.club",
  "mohit@pointblank.club",
  "yash@pointblank.club",
  "maaz@pointblank.club",
  "aditya@pointblank.club",
  "prakhar@pointblank.club",
  "pratik@pointblank.club",
  "priyanshu@pointblank.club",
  "kritik@pointblank.club",
  "dhruv@pointblank.club",
  "yuktha@pointblank.club",
  "aswin@pointblank.club",
  "prajwal@pointblank.club",
  "vivek@pointblank.club",
  "naman@pointblank.club",
  "tushar@pointblank.club",
  "gaurav@pointblank.club",
  "hansh@pointblank.club",
  "calan@pointblank.club",
  "uttkarsh@pointblank.club",
];

// Function to get email account based on user's email hash for consistent distribution
function getEmailAccountByHash(userEmail: string): string {
  let hash = 0;
  for (let i = 0; i < userEmail.length; i++) {
    const char = userEmail.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % EMAIL_ACCOUNTS.length;
  const email = EMAIL_ACCOUNTS[index];
  console.log(
    `Email selection for "${userEmail}": Using account ${index + 1}/${
      EMAIL_ACCOUNTS.length
    } - ${email}`
  );
  return email;
}

// Function to get email account based on current time for load distribution
function getEmailAccountByTime(): string {
  const now = Date.now();
  const index = Math.floor(now / 1000) % EMAIL_ACCOUNTS.length; // Changes every second
  const email = EMAIL_ACCOUNTS[index];
  console.log(
    `Time-based email selection: Using account ${index + 1}/${
      EMAIL_ACCOUNTS.length
    } - ${email}`
  );
  return email;
}

// Function to get email account with hybrid approach (hash + time)
function getEmailAccountHybrid(userEmail: string): string {
  const hashBased = getEmailAccountByHash(userEmail);
  const timeBased = getEmailAccountByTime();

  // Use hash for consistency, but add time component for load distribution
  const hash = userEmail.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const timeOffset = Math.floor(Date.now() / 60000) % EMAIL_ACCOUNTS.length; // Changes every minute
  const index = (Math.abs(hash) + timeOffset) % EMAIL_ACCOUNTS.length;
  const email = EMAIL_ACCOUNTS[index];

  console.log(
    `Hybrid email selection for "${userEmail}": Using account ${index + 1}/${
      EMAIL_ACCOUNTS.length
    } - ${email}`
  );
  return email;
}

/**
 * @swagger
 * /api/registration/recruitment:
 *   get:
 *     summary: Check if an email or phone is registered
 *     description: This endpoint checks if the provided email or phone is already registered for recruitment.
 *     tags:
 *      - Recruitment
 *     parameters:
 *       - in: query
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *           description: The email or phone number to check.
 *     responses:
 *       200:
 *         description: The identifier is already registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "email already exists"
 *                 isUnique:
 *                   type: boolean
 *                   example: false
 *       403:
 *         description: The identifier is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "email not registered"
 *                 isUnique:
 *                   type: boolean
 *                   example: true
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
export async function GET(request: Request) {
  await connectMongoDB();
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (identifier && emailRegex.test(identifier)) {
      const existing = await RecruitmentModel.findOne({
        email: identifier,
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
      const existing = await RecruitmentModel.findOne({
        whatsapp_number: identifier,
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
 * /api/registration/recruitment:
 *   post:
 *     summary: Handle recruitment actions
 *     description: This endpoint handles different recruitment actions like reCAPTCHA validation, OTP sending, OTP verification, or adding a registration.
 *     tags:
 *      - Recruitment
 *     parameters:
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           description: Action to perform (validateRecaptcha, sendOTP, verifyOTP, addRegistration)
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
 *               email:
 *                 type: string
 *                 description: Email for OTP operations.
 *               otp:
 *                 type: string
 *                 description: OTP for verification.
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
 *                   example: "Operation successful!"
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
    // const ip = request.headers.get("x-forwarded-for") || "unknown";

    // const { success } = await ratelimiter.limit(ip);
    // if (!success) {
    //   return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    // }


    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    console.log(`Recruitment API - Action: ${action}`);

    if (!action) {
      return NextResponse.json(
        { error: "Action parameter is required" },
        { status: 400 }
      );
    }

    if (action === "validateRecaptcha") {
      return validateRecaptcha(request);
    } else if (action === "sendOTP") {
      return sendOTP(request);
    } else if (action === "verifyOTP") {
      return verifyOTP(request);
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
      {
        error: "An error occurred",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/registration/recruitment/validateRecaptcha:
 *   post:
 *     summary: Validate reCAPTCHA token
 *     description: This endpoint validates the reCAPTCHA token to verify if the user is human.
 *     tags:
 *      - Recruitment
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

  return NextResponse.json({ message: "Recaptcha validated!" });
}

/**
 * @swagger
 * /api/registration/recruitment/sendOTP:
 *   post:
 *     summary: Send OTP for recruitment
 *     description: This endpoint sends an OTP to the provided email and stores registration data temporarily.
 *     tags:
 *      - Recruitment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to send OTP to.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Missing email or email already registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already registered"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
async function sendOTP(request: Request) {
  try {
    console.log("Starting OTP send process...");

    await connectMongoDB();
    while (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const { email } = await request.json();
    console.log("OTP request for email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log("Checking for existing registration...");
    const existingReg = await Promise.race([
      RecruitmentModel.findOne({ email }).lean(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 8000)
      ),
    ]);

    if (existingReg) {
      console.log("Email already registered:", email);
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log("Generated OTP for:", email);

    await Promise.race([
      TempRecruitmentUserModel.findOneAndUpdate(
        { email },
        { otp, otpExpiresAt },
        { upsert: true }
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("OTP save timeout")), 8000)
      ),
    ]);

    console.log("Sending email...");

    // Check if email credentials are available
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("Email credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Get email account using hybrid approach (hash + time) for better distribution
    const currentEmailAccount = getEmailAccountHybrid(email);
    console.log("Selected email account for user:", currentEmailAccount);

    // Try multiple SMTP configurations with rotated email account
    const smtpConfigs = [
      // Configuration 1: Port 587 with TLS
      {
        host: "server.hosting3.acm.org",
        port: 587,
        secure: false,
        auth: {
          user: currentEmailAccount,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      // Configuration 2: Port 465 with SSL
      {
        host: "server.hosting3.acm.org",
        port: 465,
        secure: true,
        auth: {
          user: currentEmailAccount,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      // Configuration 3: Port 25 (fallback)
      {
        host: "server.hosting3.acm.org",
        port: 25,
        secure: false,
        auth: {
          user: currentEmailAccount,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    ];

    let transporter;
    let emailSent = false;

    for (let i = 0; i < smtpConfigs.length; i++) {
      try {
        console.log(`Trying SMTP configuration ${i + 1}...`);
        transporter = nodemailer.createTransport(smtpConfigs[i]);

        // Verify connection configuration
        await transporter.verify();
        console.log(`SMTP configuration ${i + 1} verified successfully`);

        await transporter.sendMail({
          from: `"PointBlank Recruitment" <${currentEmailAccount}>`,
          to: email,
          subject: `[PointBlank Recruitment] Email Verification OTP: ${otp}`,
          text: `
      Your OTP for PointBlank Recruitment is:

      >>> ${otp} <<<

      It is valid for 10 minutes before it self-destructs.

      - PointBlank Team`,
        });

        console.log(
          `OTP sent successfully to: ${email} using account: ${currentEmailAccount}`
        );
        emailSent = true;
        break;
      } catch (error) {
        console.error(`SMTP configuration ${i + 1} failed:`, error);
        if (i === smtpConfigs.length - 1) {
          // Last configuration failed
          throw error;
        }
        // Try next configuration
        continue;
      }
    }

    if (!emailSent) {
      throw new Error("All SMTP configurations failed");
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      {
        error: "Failed to send OTP",
        details: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/registration/recruitment?action=verifyOTP:
 *   post:
 *     summary: Verify OTP for recruitment registration
 *     description: This endpoint verifies the OTP sent to the user's email. It only validates the OTP and does not complete the registration process.
 *     tags:
 *      - Recruitment
 *     parameters:
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [verifyOTP]
 *           description: Must be set to "verifyOTP"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address where OTP was sent
 *                 example: "user@domain.com"
 *               otp:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 description: The 6-digit OTP received via email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully!"
 *       400:
 *         description: Bad request - Missing fields or invalid/expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum:
 *                     - "Email and OTP required"
 *                     - "Invalid or expired OTP"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
async function verifyOTP(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );
    }

    const tempUser = await TempRecruitmentUserModel.findOne({ email });

    if (!tempUser) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const isOTPValid = tempUser.otp === otp;
    const isOTPExpired = tempUser.otpExpiresAt < new Date();

    if (!isOTPValid || isOTPExpired) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "OTP verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/registration/recruitment/addRegistration:
 *   post:
 *     summary: Add a new recruitment registration
 *     description: This endpoint allows users to register for recruitment.
 *     tags:
 *      - Recruitment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the applicant.
 *               email:
 *                 type: string
 *                 description: Email address.
 *               whatsapp_number:
 *                 type: string
 *                 description: WhatsApp number.
 *               college_id:
 *                 type: string
 *                 description: College ID or USN.
 *               year_of_study:
 *                 type: string
 *                 description: Year of study.
 *               branch:
 *                 type: string
 *                 description: Branch of study.
 *               about:
 *                 type: string
 *                 description: About the applicant.
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
 *                   example: "Invalid data. All fields are required."
 */
async function addRegistration(request: Request) {
  try {
    console.log("Starting recruitment registration...");

    const data = await request.json();
    console.log("Received data:", JSON.stringify(data, null, 2));

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "whatsapp_number",
      "college_id",
      "year_of_study",
      "branch",
      "about",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: missingFields,
          received: Object.keys(data),
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.whatsapp_number)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Must be 10 digits starting with 6-9",
        },
        { status: 400 }
      );
    }

    // Validate college_id based on year
    if (data.year_of_study === "1st year") {
      const admissionNumberRegex = /^[1-9][0-9][A-Z]{4}[0-9]{4}$/;
      if (!admissionNumberRegex.test(data.college_id)) {
        return NextResponse.json(
          {
            error:
              "Invalid Admission Number format for 1st year. Expected format: 19ABCD1234",
          },
          { status: 400 }
        );
      }
    } else {
      const usnRegex = /^[1][D][S][1-3][0-9][A-Z]{2}[0-9]{3}$/;
      if (!usnRegex.test(data.college_id)) {
        return NextResponse.json(
          {
            error:
              "Invalid USN format for 2nd/3rd/4th year. Expected format: 1DS21CS123",
          },
          { status: 400 }
        );
      }
    }

    console.log("Validating duplicates...");

    // Check if email, phone, or college_id already exists
    const [existingEmail, existingPhone, existingCollegeId] = await Promise.all(
      [
        RecruitmentModel.findOne({ email: data.email }),
        RecruitmentModel.findOne({ whatsapp_number: data.whatsapp_number }),
        RecruitmentModel.findOne({ college_id: data.college_id }),
      ]
    );

    if (existingEmail) {
      console.log("Email already exists:", data.email);
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    if (existingPhone) {
      console.log("Phone already exists:", data.whatsapp_number);
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 400 }
      );
    }

    if (existingCollegeId) {
      console.log("College ID already exists:", data.college_id);
      return NextResponse.json(
        { error: "College ID already registered" },
        { status: 400 }
      );
    }

    console.log("Creating new recruitment document...");
    const newDoc = new RecruitmentModel(data);
    await newDoc.save();
    console.log("Recruitment registration successful!");

    return NextResponse.json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error adding recruitment registration:", error);

    if (error instanceof Error) {
      // Handle Mongoose validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validationErrors,
            type: "validation_error",
          },
          { status: 400 }
        );
      }

      // Handle duplicate key errors
      if (
        error.name === "MongoServerError" &&
        error.message.includes("duplicate key")
      ) {
        return NextResponse.json(
          {
            error: "Duplicate entry detected",
            details: error.message,
            type: "duplicate_error",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to add registration",
        details: error instanceof Error ? error.message : String(error),
        type: "server_error",
      },
      { status: 500 }
    );
  }
}
