import { NextRequest, NextResponse } from "next/server";
import Achievementmodel from "@/models/Achievements";
import { cloudinary } from "@/Cloudinary";
import connectMongoDB from "@/lib/dbConnect";

/**
 * @swagger
 * /api/achievements:
 *   post:
 *     summary: Create a new achievement entry.
 *     description: This endpoint allows creating a new achievement entry by uploading data and an optional image to Cloudinary.
 *     tags:
 *       - Achievements
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person.
 *               email:
 *                 type: string
 *                 description: Email address of the person.
 *               batch:
 *                 type: string
 *                 description: Batch year of the person.
 *               portfolio:
 *                 type: string
 *                 description: Portfolio URL of the person.
 *               internship:
 *                 type: string
 *                 description: Internship details of the person.
 *               companyPosition:
 *                 type: string
 *                 description: Position held at the company.
 *               achievements:
 *                 type: string
 *                 description: JSON string containing achievements.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the person.
 *     responses:
 *       200:
 *         description: Achievement created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 batch:
 *                   type: string
 *                 portfolio:
 *                   type: string
 *                 internship:
 *                   type: string
 *                 companyPosition:
 *                   type: string
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 imageUrl:
 *                   type: string
 *       400:
 *         description: Bad request, missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */

/**
 * Utility function to upload an image to Cloudinary
 */
async function uploadToCloudinary(buffer: Buffer, folder: string, publicId: string) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Create a readable stream and pipe it to the Cloudinary uploader
    const { Readable } = require("stream");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // End the stream
    readableStream.pipe(uploadStream);
  });
}

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await request.formData();

    // Extract required fields
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const batch = formData.get("batch") as string | null;
    const portfolio = formData.get("portfolio") as string | null;
    const internship = formData.get("internship") as string | null;
    const companyPosition = formData.get("companyPosition") as string | null;
    const achievements = formData.get("achievements") 
      ? JSON.parse(formData.get("achievements") as string)
      : [];

    const image = formData.get("image") as File | null;

    // Validate required fields
    if (!name || !email || !batch || !achievements.length) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, batch, achievements)" },
        { status: 400 }
      );
    }

    // Check for duplicate name in the database
    const existingMember = await Achievementmodel.findOne({ name });
    if (existingMember) {
      return NextResponse.json(
        { error: `A member with the name \"${name}\" already exists.` },
        { status: 400 }
      );
    }

    // Handle image upload
    let imageUrl = null;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        const uploadResult = await uploadToCloudinary(buffer, "achievements", name);
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        return NextResponse.json(
          { error: "Image upload failed. Please try again later." },
          { status: 500 }
        );
      }
    }

    // Create a new achievement document
    const newAchievement = new Achievementmodel({
      name,
      email,
      batch,
      portfolio,
      internship,
      companyPosition,
      achievements,
      imageUrl,
    });

    const result = await newAchievement.save();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "An internal server error occurred.", details: (error as Error).message },
      { status: 500 }
    );
  }
}
