import { NextRequest, NextResponse } from "next/server";
import TestAchievements from "@/models/TestAchievements";
import connectMongoDB from "@/lib/dbConnect";

// POST method: Create or add a new achievement
export async function POST(request: Request) {
  try {
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only POST requests are supported' },
        { status: 405 }
      );
    }

    await connectMongoDB();
    const formData = await request.formData();

    const requiredFields = ['email', 'name', 'batch', 'achievements'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: 'Validation Failed', details: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const batch = formData.get("batch") as string;
    const portfolio = formData.get("portfolio") as string;
    const achievements = JSON.parse(formData.get("achievements") as string);

    const existingMember = await TestAchievements.findOne({ email });
    if (existingMember) {
      return NextResponse.json(
        { 
          error: 'Duplicate Entry', 
          details: `A member with the email ${email} already exists.` 
        },
        { status: 409 }
      );
    }

    try {
      const newAchievement = new TestAchievements({
        name,
        email,
        batch,
        portfolio,
        achievements,
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
    if (request.method !== 'GET') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only GET requests are supported' },
        { status: 405 }
      );
    }

    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let querySnapshot;
    try {
      if (email) {
        querySnapshot = await TestAchievements.find({ email });
        
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
        querySnapshot = await TestAchievements.find();
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
      achievements: member.achievements || {},
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
    if (request.method !== 'PUT') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only PUT requests are supported' },
        { status: 405 }
      );
    }

    await connectMongoDB();
    const formData = await request.formData();
    const email = formData.get("email") as string;

    if (!email) {
      return NextResponse.json(
        { 
          error: 'Validation Failed', 
          details: 'Email is required for updating a member' 
        },
        { status: 400 }
      );
    }

    const existingMember = await TestAchievements.findOne({ email });
    if (!existingMember) {
      return NextResponse.json(
        { 
          error: 'Not Found', 
          details: `No member found with the email ${email}` 
        },
        { status: 404 }
      );
    }

    const updateData: any = {
      achievements: JSON.parse(formData.get("achievements") as string),
    };

    if (formData.get("name")) updateData.name = formData.get("name") as string;
    if (formData.get("batch")) updateData.batch = formData.get("batch") as string;
    if (formData.get("portfolio")) updateData.portfolio = formData.get("portfolio") as string;

    try {
      const updatedMember = await TestAchievements.findOneAndUpdate(
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
    if (request.method !== 'DELETE') {
      return NextResponse.json(
        { error: 'Method Not Allowed', details: 'Only DELETE requests are supported' },
        { status: 405 }
      );
    }

    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { 
          error: 'Validation Failed', 
          details: 'Email is required for deletion' 
        },
        { status: 400 }
      );
    }

    const existingMember = await TestAchievements.findOne({ email });
    if (!existingMember) {
      return NextResponse.json(
        { 
          error: 'Not Found', 
          details: `No member found with the email ${email}` 
        },
        { status: 404 }
      );
    }

    try {
      await TestAchievements.deleteOne({ email });
      return NextResponse.json(
        { 
          message: 'Member Deleted Successfully',
          email 
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