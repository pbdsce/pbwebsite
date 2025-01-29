import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import { storage } from "@/Firebase";

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Uploads an image to Firebase Storage.
 *     description: Receives an image file and uploads it to Firebase Storage, returning the download URL.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 description: The name of the file in storage.
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: "https://firebasestorage.googleapis.com/v0/b/example.appspot.com/o/image.jpg"
 *       400:
 *         description: Bad request, file not provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: string
 */
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
