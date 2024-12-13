import { NextResponse } from "next/server";
import { db, storage } from "@/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  DocumentData,
  DocumentSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// GET handler to retrieve all members
export async function GET() {
  try {
    // Fetch all member documents from the Firestore collection
    const querySnapshot = await getDocs(collection(db, "pbMembers"));

    // Map the documents to extract data and include document ID
    const membersRaw = querySnapshot.docs.map(
      (doc: DocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    // Format the members' data for the response
    const members = membersRaw.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      company: member.company || "",
      year: member.year,
      linkedInUrl: member.linkedInUrl || "",
      imageUrl: member.imageUrl || "",
    }));

    // Return the formatted member data as JSON
    return NextResponse.json(members);
  } catch (error) {
    // Catch any error during the fetching process
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

// POST handler to add a new member
export async function POST(request: Request) {
  try {
    // Parse the request body to extract member data
    const data = await request.json();

    const { name, year, role, company, imageUrl, linkedInUrl } = data;

    // Check for missing required fields
    if (!name) {
      return NextResponse.json(
        { message: "Missing Name.", error: true },
        { status: 400 }
      );
    }

    // Add the new member document to the Firestore collection
    const docRef = await addDoc(collection(db, "pbMembers"), {
      name,
      year,
      role,
      company,
      linkedInUrl,
      imageUrl,
    });

    // Return success response with the new member's document ID
    return NextResponse.json(
      { message: "Member added successfully", id: docRef.id },
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

// PUT handler to update an existing member
export async function PUT(request: Request) {
  try {
    // Parse the request body to get the updated member data
    const data = await request.json();
    const { id, name, imageUrl } = data;

    // Check for missing required fields
    if (!id || !name) {
      return NextResponse.json(
        { message: "Missing required fields or member ID", error: true },
        { status: 400 }
      );
    }

    // Update member data in Firestore
    const updatedData = { ...data, imageUrl: imageUrl };
    await updateDoc(doc(db, "pbMembers", id), updatedData);

    // Return success response with the updated member data
    return NextResponse.json(
      { message: "Member updated successfully", data: updatedData },
      { status: 200 }
    );
  } catch (error) {
    // Catch and log any errors during member update
    console.error("Error updating member:", error);
    return NextResponse.json(
      { message: `Failed to update member: ${error}`, error: true },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a member and their image
export async function DELETE(request: Request) {
  try {
    // Parse the request body to get the member ID
    const { id } = await request.json();

    // Check if the member ID is provided
    if (!id) {
      return NextResponse.json(
        { message: "Missing member ID", error: true },
        { status: 400 }
      );
    }

    // Fetch the member document from Firestore
    const memberRef = doc(db, "pbMembers", id);
    const memberSnapshot = await getDoc(memberRef);

    // If the member does not exist, return a 404 response
    if (!memberSnapshot.exists()) {
      return NextResponse.json(
        { message: "Member not found", error: true },
        { status: 404 }
      );
    }

    // Extract member data and image URL
    const memberData = memberSnapshot.data();
    const imageUrl = memberData.imageUrl;

    // If an image URL exists, delete the image from Firebase Storage
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch((error) => {
        console.error("Error deleting image from Firebase Storage:", error);
        return NextResponse.json(
          { message: "Failed to delete image from storage", error: true },
          { status: 500 }
        );
      });
    }

    // Delete the member document from Firestore
    await deleteDoc(memberRef);

    // Return success response after deletion
    return NextResponse.json(
      { message: "Member and associated image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Catch and log any errors during the deletion process
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { message: "Failed to delete member", error },
      { status: 500 }
    );
  }
}
