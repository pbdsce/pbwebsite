import { NextRequest, NextResponse } from "next/server";
import Achievementmodel from "@/models/Achievements";
import { cloudinary } from "@/Cloudinary";
import { Readable } from "stream";
import { UploadApiResponse } from "cloudinary";
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
 *       500:
 *         description: Internal server error.
 *   get:
 *     summary: Retrieve achievements.
 *     description: Fetch all achievements or filter by name if provided as a query parameter.
 *     tags:
 *       - Achievements
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Optional filter by person's name.
 *     responses:
 *       200:
 *         description: Successfully retrieved achievements.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       batch:
 *                         type: string
 *                       portfolio:
 *                         type: string
 *                       internship:
 *                         type: string
 *                       companyPosition:
 *                         type: string
 *                       achievements:
 *                         type: array
 *                         items:
 *                           type: string
 *                       imageUrl:
 *                         type: string
 *       404:
 *         description: No member found with the specified name.
 *       500:
 *         description: Internal server error.
 *   put:
 *     summary: Update an existing achievement entry.
 *     description: Update an achievement entry by name, including achievements and optionally uploading a new image.
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
 *                 description: Name of the person to update (required).
 *               email:
 *                 type: string
 *                 description: Updated email address.
 *               batch:
 *                 type: string
 *                 description: Updated batch year.
 *               portfolio:
 *                 type: string
 *                 description: Updated portfolio URL.
 *               internship:
 *                 type: string
 *                 description: Updated internship details.
 *               companyPosition:
 *                 type: string
 *                 description: Updated position at company.
 *               achievements:
 *                 type: string
 *                 description: JSON string containing updated achievements.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file (optional).
 *     responses:
 *       200:
 *         description: Achievement updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     batch:
 *                       type: string
 *                     portfolio:
 *                       type: string
 *                     internship:
 *                       type: string
 *                     companyPosition:
 *                       type: string
 *                     achievements:
 *                       type: array
 *                       items:
 *                         type: string
 *                     imageUrl:
 *                       type: string
 *       400:
 *         description: Bad request, missing name field.
 *       404:
 *         description: No member found with the specified name.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete an achievement entry.
 *     description: Delete an achievement entry by name and remove associated image from Cloudinary.
 *     tags:
 *       - Achievements
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the person to delete.
 *     responses:
 *       200:
 *         description: Achievement deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Bad request, missing name parameter.
 *       404:
 *         description: No member found with the specified name.
 *       500:
 *         description: Internal server error.
 */

// POST method: Create or add a new achievement
export async function POST(request: Request) {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only POST requests are supported' },
        { status: 405 }
      );
    }

    // Validate form data
    await connectMongoDB();
    const formData = await request.formData();

    // Comprehensive input validation
    const requiredFields = ['email', 'name', 'batch', 'achievements', 'image'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: 'Validation Failed', details: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Extract data from the form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const batch = formData.get("batch") as string;
    const portfolio = formData.get("portfolio") as string;
    const internship = formData.get("internship") as string;
    const companyPosition = formData.get("companyPosition") as string;
    const achievements = JSON.parse(
      formData.get("achievements") as string
    ) as string[];
    const image: File | null = formData.get("image") as File;

    // Check if a person with the same email already exists in MongoDB
    const existingMember = await Achievementmodel.findOne({ email });
    if (existingMember) {
      return NextResponse.json(
        { 
          error: 'Duplicate Entry', 
          details: `A member with the email ${email} already exists.` 
        },
        { status: 409 }
      );
    }

    // Handle image upload to Cloudinary Storage
    if (!image) {
      return NextResponse.json(
        { 
          error: 'Upload Failed', 
          details: 'Image file is required' 
        },
        { status: 400 }
      );
    }

    let imageUrl;
    try {
      // Convert the uploaded file (File object) to a Buffer
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create a readable stream from the Buffer
      const stream = Readable.from(buffer);

      // Upload the image to Cloudinary
      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "achievements", public_id: email },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error('Upload to Cloudinary failed'));
              } else {
                resolve(result);
              }
            }
          );

          // Pipe the readable stream into the Cloudinary upload stream
          stream.pipe(uploadStream);
        }
      );
      imageUrl = uploadResult.secure_url;
    } catch (uploadError) {
      return NextResponse.json(
        { 
          error: 'Image Upload Failed', 
          details: (uploadError as Error).message 
        },
        { status: 500 }
      );
    }

    // Create new achievement with comprehensive error handling
    try {
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
      return NextResponse.json(
        { 
          message: 'Achievement Created Successfully', 
          data: result 
        },
        { status: 201 }
      );
    } catch (saveError) {
      return NextResponse.json(
        { 
          error: 'Database Save Failed', 
          details: (saveError as Error).message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in POST method:", error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// GET method: Fetch achievements based on email or fetch all if no email is provided
export async function GET(request: NextRequest) {
  try {
    // Validate request method
    if (request.method !== 'GET') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only GET requests are supported' },
        { status: 405 }
      );
    }

    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    console.log("Received email in GET method:", email);

    let querySnapshot;
    try {
      if (email) {
        querySnapshot = await Achievementmodel.find({ email });
        
        // Handle case when no member is found
        if (querySnapshot.length === 0) {
          return NextResponse.json(
            { 
              error: 'Not Found', 
              details: `No member found with email: ${email}` 
            },
            { status: 404 }
          );
        }
      } else {
        querySnapshot = await Achievementmodel.find();
      }
    } catch (queryError) {
      return NextResponse.json(
        { 
          error: 'Database Query Failed', 
          details: (queryError as Error).message 
        },
        { status: 500 }
      );
    }

    const members = querySnapshot.map((member: any) => ({
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

    return NextResponse.json(
      { 
        message: 'Members Retrieved Successfully', 
        data: members 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in GET method:", error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// PUT method: Update an existing achievement based on email
export async function PUT(request: Request) {
  try {
    // Validate request method
    if (request.method !== 'PUT') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only PUT requests are supported' },
        { status: 405 }
      );
    }

    await connectMongoDB();
    const formData = await request.formData();
    const email = formData.get("email") as string;

    console.log("Received email in PUT method:", email);
    
    // Validate email is provided
    if (!email) {
      return NextResponse.json(
        { 
          error: 'Validation Failed', 
          details: 'Email is required for updating a member' 
        },
        { status: 400 }
      );
    }

    // Fetch the existing document by email
    const existingMember = await Achievementmodel.findOne({ email });
    if (!existingMember) {
      return NextResponse.json(
        { 
          error: 'Not Found', 
          details: `No member found with the email ${email}` 
        },
        { status: 404 }
      );
    }
    
    // Use findOneAndUpdate instead of modifying the existing document
    const achievementsJson = formData.get("achievements") as string;
    const updatedAchievements = JSON.parse(achievementsJson);
    
    // Prepare update data
    const updateData: any = {
      achievements: updatedAchievements,
    };
    
    // Only add fields that are provided in the form data
    if (formData.get("name")) updateData.name = formData.get("name") as string;
    if (formData.get("batch")) updateData.batch = formData.get("batch") as string;
    if (formData.get("portfolio")) updateData.portfolio = formData.get("portfolio") as string;
    if (formData.get("internship")) updateData.internship = formData.get("internship") as string;
    if (formData.get("companyPosition")) updateData.companyPosition = formData.get("companyPosition") as string;
    
    // Handle image upload if a new image is provided
    const image = formData.get("image") as File;
    
    if (image && image.size > 0) {
      try {
        // Convert the uploaded file (File object) to a Buffer
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Create a readable stream from the Buffer
        const stream = Readable.from(buffer);
        
        // Upload the image to Cloudinary
        const uploadResult: UploadApiResponse = await new Promise(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "achievements", public_id: email },
              (error, result) => {
                if (error || !result) {
                  reject(error || new Error('Cloudinary upload failed'));
                } else {
                  resolve(result);
                }
              }
            );
            
            // Pipe the readable stream into the Cloudinary upload stream
            stream.pipe(uploadStream);
          }
        );
        updateData.imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return NextResponse.json(
          { 
            error: 'Image Upload Failed', 
            details: (uploadError as Error).message 
          },
          { status: 500 }
        );
      }
    }
    
    // Use findOneAndUpdate with { new: true, runValidators: false }
    try {
      const updatedMember = await Achievementmodel.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, runValidators: false }
      );
      
      if (!updatedMember) {
        return NextResponse.json(
          { error: 'Update Failed', details: 'Could not update the document' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          message: 'Member Updated Successfully', 
          data: updatedMember
        },
        { status: 200 }
      );
    } catch (saveError) {
      return NextResponse.json(
        { 
          error: 'Database Update Failed', 
          details: (saveError as Error).message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in PUT method:", error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// DELETE method: Delete an achievement based on email
export async function DELETE(request: NextRequest) {
  try {
    // Validate request method
    if (request.method !== 'DELETE') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only DELETE requests are supported' },
        { status: 405 }
      );
    }

    await connectMongoDB();
    
    // Get email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Validate email is provided
    if (!email) {
      return NextResponse.json(
        { 
          error: 'Validation Failed', 
          details: 'Email is required for deleting a member' 
        },
        { status: 400 }
      );
    }

    // Find the member to be deleted
    const existingMember = await Achievementmodel.findOne({ email });
    if (!existingMember) {
      return NextResponse.json(
        { 
          error: 'Not Found', 
          details: `No member found with the email ${email}` 
        },
        { status: 404 }
      );
    }

    // Get the image URL before deleting
    const imageUrl = existingMember.imageUrl;
    const publicId = imageUrl ? imageUrl.split('/').pop()?.split('.')[0] : null;

    // Delete the document from MongoDB
    try {
      const deleteResult = await Achievementmodel.deleteOne({ email });
      
      if (deleteResult.deletedCount === 0) {
        return NextResponse.json(
          { 
            error: 'Deletion Failed', 
            details: 'Could not delete the document' 
          },
          { status: 500 }
        );
      }

      // Delete image from Cloudinary if exists
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`achievements/${email}`);
        } catch (cloudinaryError) {
          // Continue even if Cloudinary delete fails
        }
      }
      
      return NextResponse.json(
        { 
          message: 'Member Deleted Successfully', 
          email: email 
        },
        { status: 200 }
      );
    } catch (deleteError) {
      return NextResponse.json(
        { 
          error: 'Database Delete Failed', 
          details: (deleteError as Error).message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}