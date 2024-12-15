import { db } from "@/Firebase";
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

// Add a new registration
export async function POST(request: Request) {
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
        message: "Email is already registered!",
        error: "Email is already registered!",
      },
      { status: 400 }
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
    return NextResponse.json(
      {
        message: "reCAPTCHA validation failed",
        error: recaptchaResult["error-codes"],
      },
      { status: 400 }
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
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
