import { db, storage } from "@/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract data from the form
    const name = formData.get("Name") as string;
    const email = formData.get("Email address") as string;
    const batch = formData.get("Batch") as string;
    const portfolio = formData.get("Portfolio/Github") as string;
    const internship = formData.get(
      "Doing internship or have done in past?"
    ) as string;
    const companyPosition = formData.get("Company and Position") as string;
    const stipend = formData.get("Stipend") as string;
    const achievements = formData.getAll("achievements") as string[];

    // Handle image upload
    const imageFile = formData.get("image") as File;
    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const storageRef = ref(storage, `images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    // Save data to Firestore without Timestamp
    const docRef = await addDoc(collection(db, "achievements"), {
      Name: name,
      Email: email,
      Batch: batch,
      Portfolio: portfolio,
      Internship: internship,
      CompanyPosition: companyPosition,
      Stipend: stipend,
      achievements: achievements,
      imageUrl: imageUrl,
    });

    return NextResponse.json({
      message: "Data saved successfully",
      id: docRef.id,
      imageUrl: imageUrl,
    });
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
