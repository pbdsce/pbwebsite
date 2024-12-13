import { db } from "@/Firebase";

import { recruitValidate } from "@/lib/server/utils";

import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

//Check if USN exists
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usn = searchParams.get("usn");
    if (!usn) {
      return NextResponse.json({ error: "usn is required" }, { status: 400 });
    }
    const q = query(
      collection(db, "pbctf_registrations"),
      where("participant1.usn", "==", usn)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return NextResponse.json(
        { message: "usn not registered", isUnique: true },
        { status: 200 }
      );
    }
    const q2 = query(
      collection(db, "pbctf_registrations"),
      where("participant2.usn", "==", usn)
    );
    const querySnapshot2 = await getDocs(q2);

    if (!querySnapshot2.empty) {
      return NextResponse.json(
        { message: "usn not unique", isUnique: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "usn already exists", isUnique: false },
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

export async function POST(request: Request) {
  try {
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
    await addDoc(collection(db, "pbctf_registrations"), data);

    return NextResponse.json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error adding registration:", error);
    return NextResponse.json(
      { error: "Failed to add registration.", details: error },
      { status: 500 }
    );
  }
}
