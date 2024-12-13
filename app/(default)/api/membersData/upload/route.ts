import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import { storage } from "@/Firebase";

// The POST function to handle file uploads to Firebase Storage
export async function POST(request: Request) {
  try {
    // Parse the form data from the incoming request
    const formData = await request.formData();

    // Retrieve the uploaded file from the form data
    const Image: File | null = formData.get('file') as File;
    
    // If no file is uploaded, return a bad request response
    if (!Image) {
      return NextResponse.json(
        { message: "Bad Request", details: "No file uploaded" },
        { status: 400 }
      );
    }

    // Retrieve the name of the image from the form data
    const name: string = formData.get('name') as string;

    // Create a reference in Firebase Storage with the image name
    const imageRef = ref(storage, `members/${name}`);

    // Upload the image to Firebase Storage
    await uploadBytes(imageRef, Image);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(imageRef);

    // Return the image URL as the response
    return NextResponse.json({
      imageUrl: imageUrl
    });

  } catch (e) {
    // Log any error that occurs during the process
    console.error("Error during file upload:", e);

    // Return a server error response if something goes wrong
    return NextResponse.json(
      { message: "Internal Server Error", details: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
