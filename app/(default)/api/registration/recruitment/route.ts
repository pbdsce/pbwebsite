import { db } from "@/Firebase";
import connectMongoDB from "@/lib/dbConnect";
import { recruitValidate } from "@/lib/server/utils";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// Helper validation functions
const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone);

// Validate Admission Number (1st Years)
const validateAdmissionNumber = (admissionNumber: string): boolean =>
  /^[1-9][0-9][A-Z]{4}[0-9]{4}$/.test(admissionNumber);

// Validate USN (Other Years)
const validateUSN = (usn: string): boolean =>
  /^[1][D][S][1-3][0-9][A-Z]{2}[0-9]{3}$/.test(usn);
/**
 * @swagger
 * components:
 *   schemas:
 *     RegistrationRequest:
 *       type: object
 *       required:
 *         - email
 *         - whatsapp_number
 *         - college_id
 *         - year_of_study
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the participant.
 *         whatsapp_number:
 *           type: string
 *           description: The WhatsApp number of the participant.
 *         college_id:
 *           type: string
 *           description: The college ID or USN of the participant.
 *         year_of_study:
 *           type: integer
 *           description: The year of study of the participant.
 *         recaptcha_token:
 *           type: string
 *           description: The reCAPTCHA validation token.
 *     RegistrationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The response message indicating success or failure.
 *         error:
 *           type: string
 *           description: A specific error message if any.
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new participant for recruitment.
 *     description: Validates the input and reCAPTCHA, then stores the registration details in Firebase.
 *     tags:
 *      - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       400:
 *         description: Validation failed or input errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 */
// Add a new registration
export async function POST(request: Request) {
<<<<<<< HEAD
  await connectMongoDB();
  const formData = await request.json();
  const { recaptcha_token, ...data } = formData;
  const { email, whatsapp_number, college_id, year_of_study } = formData;

  // Check if required fields are present
  if (!email || !whatsapp_number || !college_id) {
    return NextResponse.json(
      {
        message: "Missing required fields",
        error: "Missing required fields",
      },
      { status: 400 }
    );
  }
=======
  try {
    // const ip = request.headers.get("x-forwarded-for") || "unknown";

    // const { success } = await ratelimiter.limit(ip);
    // if (!success) {
    //   return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    // }
>>>>>>> 675798d (make changes to recruitment form)

  // Validate email
  if (!validateEmail(email)) {
    return NextResponse.json(
      {
        message: "Invalid email format",
        error: "Invalid email format",
      },
      { status: 400 }
    );
  }

<<<<<<< HEAD
  // Validate phone number
  if (!validatePhone(whatsapp_number)) {
    return NextResponse.json(
      {
        message: "Invalid phone number format",
        error: "Invalid phone number format",
      },
      { status: 400 }
    );
  }

  // Validate College ID based on year
  if (year_of_study == 1) {
    if (!validateAdmissionNumber(college_id)) {
=======
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
>>>>>>> 675798d (make changes to recruitment form)
      return NextResponse.json(
        {
          message: "Invalid Admission Number format. Example: 19ABCD1234",
          error: "Invalid Admission Number format",
        },
        { status: 400 }
      );
    }
  } else {
    if (!validateUSN(college_id)) {
      return NextResponse.json(
        {
          message: "Invalid USN format. Example: 1DS21CS123",
          error: "Invalid USN format",
        },
        { status: 400 }
      );
    }
  }

  // Only one registration per person
  const emailQuery = query(
    collection(db, "recruitment2024"),
    where("email", "==", email)
  );

  const phoneQuery = query(
    collection(db, "recruitment2024"),
    where("whatsapp_number", "==", whatsapp_number)
  );

  const collegeIdQuery = query(
    collection(db, "recruitment2024"),
    where("college_id", "==", college_id)
  );

  // Fetch results from all queries
  const [emailSnapshot, phoneSnapshot, collegeIdSnapshot] = await Promise.all([
    getDocs(emailQuery),
    getDocs(phoneQuery),
    getDocs(collegeIdQuery),
  ]);

  if (!emailSnapshot.empty) {
    return NextResponse.json(
      {
<<<<<<< HEAD
        message: "Email is already registered!",
        error: "Email is already registered!",
      },
      { status: 400 }
=======
        error: "An error occurred",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
>>>>>>> 675798d (make changes to recruitment form)
    );
  }

  if (!phoneSnapshot.empty) {
    return NextResponse.json(
      {
        message: "WhatsApp number is already registered!",
        error: "WhatsApp number is already registered!",
      },
      { status: 400 }
    );
  }

  if (!collegeIdSnapshot.empty) {
    return NextResponse.json(
      {
        message: "College ID is already registered!",
        error: "College ID is already registered!",
      },
      { status: 400 }
    );
  }

  // reCAPTCHA verification
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
      { status: 400 }
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
<<<<<<< HEAD
    return NextResponse.json(
      {
        message: "reCAPTCHA validation failed",
        error: recaptchaResult["error-codes"],
      },
      { status: 400 }
=======
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

    console.log("Email user:", process.env.MAIL_USER);

    // Try multiple SMTP configurations
    const smtpConfigs = [
      // Configuration 1: Port 587 with TLS
      {
        host: "server.hosting3.acm.org",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
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
          user: process.env.MAIL_USER,
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
          user: process.env.MAIL_USER,
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
          from: `"Recruitment Registration" <${process.env.MAIL_USER}>`,
          to: email,
          subject: `[PointBlank Recruitment] Email Verification OTP: ${otp}`,
          text: `
      Your OTP for PointBlank Recruitment is:

      >>> ${otp} <<<

      It is valid for 10 minutes before it self-destructs.

      - PointBlank Team`,
        });

        console.log("OTP sent successfully to:", email);
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
>>>>>>> 675798d (make changes to recruitment form)
    );
  }

  // Validate the rest of the data
  const val = recruitValidate(data);

  if (val.error) {
    return NextResponse.json(
      { message: "Validation error", error: val.error },
      { status: 400 }
    );
  }

  // Save to Firebase
  try {
    await addDoc(collection(db, "recruitment2024"), data);
    return NextResponse.json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
<<<<<<< HEAD
      { message: "An error occurred", error },
=======
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
>>>>>>> 675798d (make changes to recruitment form)
      { status: 500 }
    );
  }
}
