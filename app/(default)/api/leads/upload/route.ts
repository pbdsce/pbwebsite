import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import { storage } from "@/Firebase";


export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const Image: File | null = formData.get('file') as File;
    if (!Image) {
      return NextResponse.json(
        { message: "Bad Request", details: "No file uploaded" },
        { status: 400 }
      );
    }

    const name: string = formData.get('name') as string;
    const imageRef = ref(storage, `images/${name}`);
    await uploadBytes(imageRef, Image);
    const imageUrl = await getDownloadURL(imageRef);

    return NextResponse.json({
      imageUrl: imageUrl
    });
  } catch (error:any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
