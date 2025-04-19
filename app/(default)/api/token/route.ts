import { NextRequest, NextResponse } from "next/server";

// POST Method to Set Token
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token missing in request body" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ message: "Token set successfully" });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body, failed to parse JSON" },
      { status: 400 }
    );
  }
}

// GET Method to Retrieve Token
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No token found in cookies" },
      { status: 401 } 
    );
  }

  return NextResponse.json({ token });
}

// DELETE Method to Remove Token
export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ message: "Token deleted successfully" });

  
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    path: "/",
    maxAge: 0, 
  });

  return response;
}
