import { db } from "@/Firebase";
import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get("uid");

        if (!uid) {
            return NextResponse.json(
                { error: "UID is required" },
                { status: 400 }
            );
        }

        const adminDocRef = doc(db, "admin", uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (!adminDocSnap.exists()) {
            return NextResponse.json(
                { error: "User is not an admin", isAdmin: false },
                { status: 403 }
            );
        } else {
            return NextResponse.json(
                { message: "User is an admin", isAdmin: true },
                { status: 200 }
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error details:", error.message);
            return NextResponse.json(
                { error: "An error occurred", details: error.message },
                { status: 500 }
            );
        } else {
            console.error("Unknown error:", error);
            return NextResponse.json(
                { error: "An unknown error occurred" },
                { status: 500 }
            );
        }
    }
}

export async function POST(request: Request) {
    const { email, role, userId } = await request.json();

    // Validate required fields
    if (!email || !role || !userId) {
        return NextResponse.json(
            { error: "Email, role, and userId are required" },
            { status: 400 }
        );
    }

    // Validate email format 
    if (!emailRegex.test(email)) {
        return NextResponse.json(
            { error: "Invalid email format" },
            { status: 400 }
        );
    }

    // Validate role (ensure it's one of the allowed roles, e.g., admin, user)
    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(role)) {
        return NextResponse.json(
            { error: `Invalid role. Allowed roles are: ${allowedRoles.join(', ')}` },
            { status: 400 }
        );
    }

    try {
        await setDoc(doc(db, 'admin', userId), {
            email,
            role,
        });

        return NextResponse.json(
            { message: "Admin data saved successfully" },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error details:", error.message);
            return NextResponse.json(
                { error: "An error occurred", details: error.message },
                { status: 500 }
            );
        } else {
            console.error("Unknown error:", error);
            return NextResponse.json(
                { error: "An unknown error occurred" },
                { status: 500 }
            );
        }
    }
}
