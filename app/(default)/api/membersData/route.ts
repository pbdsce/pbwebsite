import { NextResponse } from "next/server";
import { cloudinary } from "@/Cloudinary";
import connectMongoDB from "@/lib/dbConnect";
import Membersmodel from "@/models/Members";
import { ObjectId } from "mongodb";
/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Retrieve all members
 *     description: Fetches all members from the database and returns their details.
 *     tags:
 *      - Members
 *     responses:
 *       200:
 *         description: A list of all members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   company:
 *                     type: string
 *                   year:
 *                     type: string
 *                   linkedInUrl:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *       500:
 *         description: Internal server error
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
// GET handler to retrieve all members
export async function GET() {
  try {
    await connectMongoDB();
    const querySnapshot = await Membersmodel.find();
    const members = querySnapshot.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      company: member.company || "",
      year: member.year,
      linkedInUrl: member.linkedInUrl || "",
      imageUrl: member.imageUrl || "",
    }));

    return NextResponse.json(members);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching members:", error.message);
      return NextResponse.json(
        {
          error: "An error occurred while fetching members",
          details: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred while fetching members" },
        { status: 500 }
      );
    }
  }
}
/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Add a new member
 *     description: Adds a new member to the database with the provided details.
 *     tags:
 *      - Members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               company:
 *                 type: string
 *               year:
 *                 type: string
 *               linkedInUrl:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member added successfully"
 *                 savedMember:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       400:
 *         description: Missing required field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing Name."
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to add member"
 *                 error:
 *                   type: boolean
 *                   example: true
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { name } = data;

    if (!name) {
      return NextResponse.json(
        { message: "Missing Name.", error: true },
        { status: 400 }
      );
    }

    // Add the new member document to the Firestore collection

    const newMember = new Membersmodel({
      ...data,
    });
    const savedMember = await newMember.save();

    // Return success response with the new member's document ID
    return NextResponse.json(
      { message: "Member added successfully", savedMember },
      { status: 201 }
    );
  } catch (error) {
    // Catch and log any errors during member creation
    console.error("Error adding member:", error);
    return NextResponse.json(
      { message: `Failed to add member: ${error}`, error: true },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/members:
 *   put:
 *     summary: Update an existing member
 *     description: Updates the details of an existing member in the database.
 *     tags:
 *      - Members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               company:
 *                 type: string
 *               year:
 *                 type: string
 *               linkedInUrl:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       400:
 *         description: "Missing required fields: 'id' and 'name' are mandatory."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields: 'id' and 'name' are mandatory."
 *                 error:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Member not found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No member found with ID: <id>"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update member"
 *                 error:
 *                   type: boolean
 *                   example: true
 */
// PUT handler to update an existing member
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, name } = data;
    const newid: Object = new ObjectId(id);
    // Validate required fields
    if (!id || !name) {
      return NextResponse.json(
        {
          message: "Missing required fields: 'id' and 'name' are mandatory.",
          error: true,
        },
        { status: 400 }
      );
    }

    // Find the existing member to get their current image URL
    const existingMember = await Membersmodel.findOne({ _id: newid });
    
    if (!existingMember) {
      return NextResponse.json(
        { message: `No member found with ID: ${id}`, error: true },
        { status: 404 }
      );
    }
    
    // Check if imageUrl is being updated
    if (data.imageUrl && existingMember.imageUrl && data.imageUrl !== existingMember.imageUrl) {
      try {
        // Extract the name and timestamp from the URL
        const urlParts = existingMember.imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1].split('.')[0];
        
        // Use the correct folder name "pbmembers" as used during upload
        const publicId = `pbmembers/${filename}`;
        
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
        console.log("Old Cloudinary image deleted:", publicId);
      } catch (error) {
        console.error("Error during Cloudinary image deletion:", error);
        // Continue with member update even if image deletion fails
        console.log("Continuing with member update despite image deletion failure");
      }
    }

    // Update the member in the database
    const updatedData = await Membersmodel.findOneAndUpdate(
      { _id: newid },
      { ...data },
      { new: true }
    );

    // Return success response
    return NextResponse.json(
      { message: "Member updated successfully", data: updatedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      {
        message: `Failed to update member: ${(error as Error).message}`,
        error: true,
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/members:
 *   delete:
 *     summary: Delete a member and their image
 *     description: Deletes a member from the database along with their associated image from Cloudinary.
 *     tags:
 *      - Members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member and image deleted successfully
 *       400:
 *         description: Missing member ID
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
// DELETE handler to delete a member and their image
export async function DELETE(request: Request) {
  try {
    // Parse the request body to get the member ID
    const { id } = await request.json();

    // Validate the member ID
    if (!id) {
      return NextResponse.json(
        { message: "Missing member ID", error: true },
        { status: 400 }
      );
    }

    const newid: Object = new ObjectId(id);

    // Find the member in the database
    const memberSnapshot = await Membersmodel.findOne({ _id: newid });

    // If the member does not exist, return a 404 response
    if (!memberSnapshot) {
      return NextResponse.json(
        { message: "Member not found", error: true },
        { status: 404 }
      );
    }

    const memberData = memberSnapshot;
    const imageUrl = memberData.imageUrl;

    // If the member has an associated image URL, delete it from Cloudinary
    if (imageUrl) {
      try {
        // Extract the name and timestamp from the URL
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1].split('.')[0];
        const publicId = `pbmembers/${filename}`;
        
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary image deleted:", publicId);
      } catch (error) {
        console.error("Error during Cloudinary image deletion:", error);
        // Continue with member deletion even if image deletion fails
        console.log("Continuing with member deletion despite image deletion failure");
      }
    }

    // Delete the member document from the database
    await Membersmodel.deleteOne({ _id: newid });

    // Return a success response
    return NextResponse.json(
      { message: "Member and associated image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log and return an error response
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { message: "Failed to delete member", error },
      { status: 500 }
    );
  }
}
