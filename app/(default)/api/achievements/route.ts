/*
import { NextRequest, NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import connectMongoDB from "@/lib/dbConnect";
import Achievementmodel from "@/models/Achievements";
import { db, storage } from "@/Firebase";

// POST method: Create or add a new achievement
export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();

    // Extract data from the form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const batch = formData.get("batch") as string;
    const portfolio = formData.get("portfolio") as string;
    const internship = formData.get("internship") as string;
    const companyPosition = formData.get("companyPosition") as string;
    const achievements = JSON.parse(formData.get("achievements") as string) as string[];
    const image = formData.get("image") as File;

    // Check if a person with the same name already exists in MongoDB
    const existingMember = await Achievementmodel.findOne({ name });
    if (existingMember) {
      return NextResponse.json(
        { error: `A member with the name ${name} already exists.` },
        { status: 400 }
      );
    }

    // Handle image upload to Firebase Storage
    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    
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
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "An error occurred", details:(error as Error).message},
      { status: 500 }
    );
  }
}

// GET method: Fetch achievements based on name or fetch all if no name is provided
export async function GET(request: NextRequest) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    let querySnapshot;

    if (name) {
      querySnapshot = await Achievementmodel.find({ name });
    } else {
      querySnapshot = await Achievementmodel.find();
    }

    const members = querySnapshot.map((member: any) => {
      return {
        id: member._id,
        name: member.name,
        email: member.email || null,
        batch: member.batch || null,
        portfolio: member.portfolio || null,
        internship: member.internship || null,
        companyPosition: member.companyPosition || null,
        achievements: member.achievements || [],
        imageUrl: member.imageUrl || null,
      };
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching members", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT method: Update an existing achievement based on name
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;

    // Fetch the existing document by name
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
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Update the member data
    existingMember.email = email;
    existingMember.batch = batch;
    existingMember.portfolio = portfolio;
    existingMember.internship = internship;
    existingMember.companyPosition = companyPosition;
    existingMember.achievements = achievements;
    existingMember.imageUrl = imageUrl;

    await existingMember.save(); // Save the updated document

    return NextResponse.json(existingMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "An error occurred while updating", details: (error as Error).message },
      { status: 500 }
    );
  }
}
*/
import { NextRequest, NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import connectMongoDB from "@/lib/dbConnect";
import Achievementmodel from "@/models/Achievements";
import { db, storage } from "@/Firebase";

/**
 * @swagger
 * /api/achievements:
 *   post:
 *     summary: Create or add a new achievement
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
 *               email:
 *                 type: string
 *               batch:
 *                 type: string
 *               portfolio:
 *                 type: string
 *               internship:
 *                 type: string
 *               companyPosition:
 *                 type: string
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: file
 *     responses:
 *       200:
 *         description: Achievement created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();

    // Extract data from the form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const batch = formData.get("batch") as string;
    const portfolio = formData.get("portfolio") as string;
    const internship = formData.get("internship") as string;
    const companyPosition = formData.get("companyPosition") as string;
    const achievements = JSON.parse(formData.get("achievements") as string) as string[];
    const image = formData.get("image") as File;

    // Check if a person with the same name already exists in MongoDB
    const existingMember = await Achievementmodel.findOne({ name });
    if (existingMember) {
      return NextResponse.json(
        { error: `A member with the name ${name} already exists.` },
        { status: 400 }
      );
    }

    // Handle image upload to Firebase Storage
    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

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
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "An error occurred", details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Fetch all achievements or achievements by name
 *     tags:
 *       - Achievements
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Name of the achievement to search for
 *     responses:
 *       200:
 *         description: List of achievements
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  await connectMongoDB();

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    let querySnapshot;

    if (name) {
      querySnapshot = await Achievementmodel.find({ name });
    } else {
      querySnapshot = await Achievementmodel.find();
    }

    const members = querySnapshot.map((member: any) => {
      return {
        id: member._id,
        name: member.name,
        email: member.email || null,
        batch: member.batch || null,
        portfolio: member.portfolio || null,
        internship: member.internship || null,
        companyPosition: member.companyPosition || null,
        achievements: member.achievements || [],
        imageUrl: member.imageUrl || null,
      };
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching members", details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/achievements:
 *   put:
 *     summary: Update an existing achievement
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
 *               email:
 *                 type: string
 *               batch:
 *                 type: string
 *               portfolio:
 *                 type: string
 *               internship:
 *                 type: string
 *               companyPosition:
 *                 type: string
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: file
 *     responses:
 *       200:
 *         description: Achievement updated successfully
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;

    // Fetch the existing document by name
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
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Update the member data
    existingMember.email = email;
    existingMember.batch = batch;
    existingMember.portfolio = portfolio;
    existingMember.internship = internship;
    existingMember.companyPosition = companyPosition;
    existingMember.achievements = achievements;
    existingMember.imageUrl = imageUrl;

    await existingMember.save(); // Save the updated document

    return NextResponse.json(existingMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "An error occurred while updating", details: (error as Error).message },
      { status: 500 }
    );
  }
}
