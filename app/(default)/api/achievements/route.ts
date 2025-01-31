import { NextRequest, NextResponse } from "next/server";
import Achievementmodel from "@/models/Achievements";
import { cloudinary } from "@/Cloudinary";
import { Readable } from "stream";
import { UploadApiResponse } from "cloudinary";
import connectMongoDB from "@/lib/dbConnect";

/* Keep the Swagger documentation as is */

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
 *       500:
 *         description: Internal server error.
 */

/**
 * Utility function to upload an image to Cloudinary
 */
async function uploadToCloudinary(buffer: Buffer, folder: string, publicId: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId },
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
}

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await request.formData();

    // Extract required fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const batch = formData.get("batch") as string;
    const portfolio = formData.get("portfolio") as string;
    const internship = formData.get("internship") as string;
    const companyPosition = formData.get("companyPosition") as string;
    const achievements = JSON.parse(formData.get("achievements") as string) as string[];
    const image = formData.get("image") as File;

    // Validate required fields
    if (!name || !email || !batch || !achievements.length) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, batch, achievements)" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existingMember = await Achievementmodel.findOne({ name });
    if (existingMember) {
      return NextResponse.json(
        { error: `A member with the name ${name} already exists.` },
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

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    const query = name ? { name } : {};
    const achievements = await Achievementmodel.find(query);

    const members = achievements.map((member: any) => ({
      id: member._id,
      name: member.name,
      email: member.email || null,
      batch: member.batch || null,
      portfolio: member.portfolio || null,
      internship: member.internship || null,
      companyPosition: member.companyPosition || null,
      achievements: member.achievements || [],
      imageUrl: member.imageUrl || null,
    }));

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching members", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    const name = formData.get("name") as string;

    const existingMember = await Achievementmodel.findOne({ name });
    if (!existingMember) {
      return NextResponse.json(
        { error: `No member found with the name ${name}` },
        { status: 404 }
      );
    }

    // Extract data from the form, using existing values if new data is not provided
    const email = (formData.get("email") as string) || existingMember.email;
    const batch = (formData.get("batch") as string) || existingMember.batch;
    const portfolio = (formData.get("portfolio") as string) || existingMember.portfolio;
    const internship = (formData.get("internship") as string) || existingMember.internship;
    const companyPosition = (formData.get("companyPosition") as string) || existingMember.companyPosition;
    const achievements = formData.get("achievements")
      ? JSON.parse(formData.get("achievements") as string)
      : existingMember.achievements;
    const image = formData.get("image") as File;

    let imageUrl = existingMember.imageUrl;

    // Handle image upload if a new image is provided
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

    // Update the member data
    existingMember.email = email;
    existingMember.batch = batch;
    existingMember.portfolio = portfolio;
    existingMember.internship = internship;
    existingMember.companyPosition = companyPosition;
    existingMember.achievements = achievements;
    existingMember.imageUrl = imageUrl;

    await existingMember.save();
    return NextResponse.json(existingMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "An error occurred while updating", details: (error as Error).message },
      { status: 500 }
    );
  }
}