import { db } from "@/Firebase";
import connectMongoDB from "@/lib/dbConnect";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Check if a user is an admin
 *     description: This endpoint checks whether a user with the given UID is an admin.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: uid
 *         required: true
 *         description: The UID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user is an admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is an admin"
 *                 isLoggedIn:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing UID parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "UID is required"
 *       403:
 *         description: The user is not an admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User is not an admin"
 *                 isLoggedIn:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Error details"
 */

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Add or update admin data
 *     description: This endpoint adds or updates an admin's email and role in the system.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the admin.
 *               role:
 *                 type: string
 *                 description: Role of the user (either 'admin' or 'user').
 *               userId:
 *                 type: string
 *                 description: The unique ID of the user.
 *             required:
 *               - email
 *               - role
 *               - userId
 *     responses:
 *       200:
 *         description: Admin data saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin data saved successfully"
 *       400:
 *         description: Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email format"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 *                 details:
 *                   type: string
 *                   example: "Error details"
 */

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "UID is required" },
        { status: 400 },
      );
    }

    const adminDocRef = doc(db, "admin", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (!adminDocSnap.exists()) {
      return NextResponse.json(
        { error: "User is not an admin", isLoggedIn: false },
        { status: 403 },
      );
    } else {
      return NextResponse.json(
        { message: "User is an admin", isLoggedIn: true },
        { status: 200 },
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      return NextResponse.json(
        { error: "An error occurred", details: error.message },
        { status: 500 },
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}

// export async function POST(request: Request) {
//   const { email, role, userId } = await request.json();

//   // Validate required field
//   if (!email || !role || !userId) {
//     return NextResponse.json(
//       { error: "Email, role, and userId are required" },
//       { status: 400 },
//     );
//   }

//   // Validate email format
//   if (!emailRegex.test(email)) {
//     return NextResponse.json(
//       { error: "Invalid email format" },
//       { status: 400 },
//     );
//   }

//   // Validate role (ensure it's one of the allowed roles, e.g., admin, user)
//   const allowedRoles = ["admin", "user"];
//   if (!allowedRoles.includes(role)) {
//     return NextResponse.json(
//       { error: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}` },
//       { status: 400 },
//     );
//   }

//   try {
//     await setDoc(doc(db, "admin", userId), {
//       email,
//       role,
//     });

//     return NextResponse.json(
//       { message: "Admin data saved successfully" },
//       { status: 200 },
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error details:", error.message);
//       return NextResponse.json(
//         { error: "An error occurred", details: error.message },
//         { status: 500 },
//       );
//     } else {
//       console.error("Unknown error:", error);
//       return NextResponse.json(
//         { error: "An unknown error occurred" },
//         { status: 500 },
//       );
//     }
//   }
// }
