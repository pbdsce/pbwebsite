import { NextRequest, NextResponse } from "next/server";
import AchievementsCategory from "@/models/AchievementsCategory";
import connectMongoDB from "@/lib/dbConnect";
import { Readable } from "stream";
import { cloudinary } from "@/Cloudinary";

// POST method: Create or add a new achievement
export async function POST(request: Request) {
  try {
    // Validate form data
    await connectMongoDB();
    const formData = await request.formData();

    // Comprehensive input validation
    const requiredFields = ['name', 'achievements'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: 'Validation Failed', details: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const name = formData.get("name") as string;
    const achievements = JSON.parse(formData.get("achievements") as string);
    const image = formData.get("image") as File;

    const existingMember = await AchievementsCategory.findOne({ name });
    if (existingMember) {
      return NextResponse.json(
        { 
          error: 'Duplicate Entry', 
          details: `A member with the name ${name} already exists.` 
        },
        { status: 409 }
      );
    }

    let imageUrl = null;
    if (image) {
      try {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = Readable.from(buffer);
        
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "achievements", public_id: name },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error('Upload to Cloudinary failed'));
              } else {
                resolve(result);
              }
            }
          );
          stream.pipe(uploadStream);
        });
        imageUrl = (uploadResult as any).secure_url;
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

    try {
      const newAchievement = new AchievementsCategory({
        name,
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

// GET method: Fetch achievements based on name or fetch all if no name is provided
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    let querySnapshot;
    try {
      if (name) {
        querySnapshot = await AchievementsCategory.find({ name });
        
        if (querySnapshot.length === 0) {
          return NextResponse.json(
            { 
              error: 'Not Found', 
              details: `No member found with name: ${name}` 
            },
            { status: 404 }
          );
        }
      } else {
        querySnapshot = await AchievementsCategory.find();
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
      achievements: member.achievements || {},
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

// PUT method: Update an existing achievement based on name
export async function PUT(request: Request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    const name = formData.get("name") as string;

    if (!name) {
      return NextResponse.json(
        { 
          error: 'Validation Failed', 
          details: 'Name is required for updating a member' 
        },
        { status: 400 }
      );
    }

    const existingMember = await AchievementsCategory.findOne({ name });
    if (!existingMember) {
      return NextResponse.json(
        { 
          error: 'Not Found', 
          details: `No member found with the name ${name}` 
        },
        { status: 404 }
      );
    }

    const updateData: any = {
      achievements: JSON.parse(formData.get("achievements") as string),
    };

    const image = formData.get("image") as File;
    if (image) {
      try {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = Readable.from(buffer);
        
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "achievements", public_id: name },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error('Upload to Cloudinary failed'));
              } else {
                resolve(result);
              }
            }
          );
          stream.pipe(uploadStream);
        });
        updateData.imageUrl = (uploadResult as any).secure_url;
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

    try {
      const updatedMember = await AchievementsCategory.findOneAndUpdate(
        { name },
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
    } catch (updateError) {
      return NextResponse.json(
        { 
          error: 'Update Failed', 
          details: (updateError as Error).message 
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

// DELETE method: Remove a member's achievements based on name
export async function DELETE(request: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { 
          error: 'Validation Failed', 
          details: 'Name is required for deleting a member' 
        },
        { status: 400 }
      );
    }

    const existingMember = await AchievementsCategory.findOne({ name });
    if (!existingMember) {
      return NextResponse.json(
        { 
          error: 'Not Found', 
          details: `No member found with the name ${name}` 
        },
        { status: 404 }
      );
    }

    try {
      await AchievementsCategory.deleteOne({ name });
      return NextResponse.json(
        { 
          message: 'Member Deleted Successfully' 
        },
        { status: 200 }
      );
    } catch (deleteError) {
      return NextResponse.json(
        { 
          error: 'Delete Failed', 
          details: (deleteError as Error).message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in DELETE method:", error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 