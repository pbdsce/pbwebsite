import { db } from "@/Firebase";
import { sihValidate } from "@/lib/server/utils";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// Utility functions for format validation
const validateEmail = (email:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone:string) => /^[6-9]\d{9}$/.test(phone);
const validateYearOfStudy = (year:string) => /^\d{4}$/.test(year);
const validateCollegeID = (enrollment_id:string) => /^[1][D][S][1-2][0-9][A-Z][A-Z][0-9]{3}/.test(enrollment_id);


export async function POST(request: Request) {
  const formData = await request.json();
  const { recaptcha_token, ...data } = formData;

  // Validate required fields in team_info and leader
  if (
    !data.team_info.team_name ||
    !data.team_info.team_leader.name ||
    !data.team_info.team_leader.email ||
    !data.team_info.team_leader.phone ||
    !data.team_info.team_leader.role ||
    !data.team_info.team_leader.enrollment_id ||
    !data.team_info.team_leader.course ||
    !data.team_info.team_leader.year_of_study ||
    !data.team_info.team_leader.branch
  ) {
    return NextResponse.json(
      {
        message: "Required team leader or team information is missing.",
        error: "Missing fields in team_info or team_leader",
      },
      { status: 400 }
    );
  }

  // Validate team leader details format
  const leader = data.team_info.team_leader;
  if (!validateEmail(leader.email)) {
    return NextResponse.json(
      {
        message: "Invalid email format for team leader.",
        error: "Invalid email",
      },
      { status: 400 }
    );
  }
  if (!validatePhone(leader.phone)) {
    return NextResponse.json(
      {
        message: "Invalid phone number format for team leader.",
        error: "Invalid phone",
      },
      { status: 400 }
    );
  }
  if (!validateYearOfStudy(leader.year_of_study)) {
    return NextResponse.json(
      {
        message: "Year of study for team leader must be a 4-digit number.",
        error: "Invalid year_of_study",
      },
      { status: 400 }
    );
  }
    if (!validateCollegeID(leader.enrollment_id)) {
      return NextResponse.json(
        {
          message: "Fromat Of Enrollment ID is Invald!.",
          error: "Invalid enrollment_id",
        },
        { status: 400 }
      );
  }

  // Validate team members
  if (!Array.isArray(data.team_info.team_members)) {
    return NextResponse.json(
      {
        message: "Team members should be an array.",
        error: "Invalid team_members structure",
      },
      { status: 400 }
    );
  }

  for (let i = 0; i < data.team_info.team_members.length; i++) {
    const member = data.team_info.team_members[i];
    if (
      !member.name ||
      !member.email ||
      !member.phone ||
      !member.role ||
      !member.enrollment_id ||
      !member.course ||
      !member.year_of_study ||
      !member.branch
    ) {
      return NextResponse.json(
        {
          message: `Missing fields for team member at index ${i}`,
          error: `Incomplete details for team member ${i}`,
        },
        { status: 400 }
      );
    }

    // Validate team member details format
    if (!validateEmail(member.email)) {
      return NextResponse.json(
        {
          message: `Invalid email format for team member at index ${i}.`,
          error: `Invalid email for team member ${i}`,
        },
        { status: 400 }
      );
    }
    if (!validatePhone(member.phone)) {
      return NextResponse.json(
        {
          message: `Invalid phone number format for team member at index ${i}.`,
          error: `Invalid phone for team member ${i}`,
        },
        { status: 400 }
      );
    }
    if (!validateYearOfStudy(member.year_of_study)) {
      return NextResponse.json(
        {
          message: `Year of study for team member at index ${i} must be a 4-digit number.`,
          error: `Invalid year_of_study for team member ${i}`,
        },
        { status: 400 }
      );
    }
    if (!validateCollegeID(member.enrollment_id)) {
      return NextResponse.json(
        {
          message: `Enrollment If Of Team Member ${i} is Invalid.`,
          error: `Invalid enrollment_id for team member ${i}`,
        },
        { status: 400 }
      );
    }
  }

  // Check for duplicate email registration
  const { team_info: { team_leader: { email } } } = data;
  const q = query(
    collection(db, "sih2024"),
    where("team_info.team_leader.email", "==", email)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return NextResponse.json(
      {
        message: "Email is already registered!",
        error: "Email is already registered!",
      },
      { status: 400 }
    );
  }

  //Validate Project Details
  if(
    !data.project_infromation.title ||
    !data.project_infromation.abstract ||
    !data.project_infromation.problem_statement ||
    !data.project_infromation.tech_stack
  ) {
    return NextResponse.json(
      {
        message: "Project Details Haven't been provided!",
        error: "Project Details not provided!"
      },
      {status: 400}
    );
  }

  const recaptchaToken = recaptcha_token;
  if (!recaptchaToken) {
    return NextResponse.json(
      {
        message: "reCAPTCHA token not found! Refresh and try again",
        error: "reCAPTCHA token not found!",
      },
      { status: 400 }
    );
  }

  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

  // Verify reCAPTCHA token
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`,
    { method: "POST" }
  );
  const recaptchaResult = await recaptchaResponse.json();

  if (!recaptchaResult.success) {
    return NextResponse.json(
      {
        message: "reCAPTCHA validation failed",
        error: recaptchaResult["error-codes"],
      },
      { status: 400 }
    );
  }

  // Validate the data
  const val = sihValidate(data);

  try {
    // Save to Firebase
    const docRef = await addDoc(collection(db, "sih2024"), data);
    return NextResponse.json({ message: "Registration successful", id: docRef.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
