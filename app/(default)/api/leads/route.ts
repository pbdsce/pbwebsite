import { db } from "@/Firebase";
import {
    getDocs,
    collection,
    updateDoc,
    doc,
    deleteDoc,
    setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

interface Lead {
    id: string;
    name: string;
    position: string;
    organization: string;
    additionalInfo: string;
    imageUrl: string;
}

function validateLeadData(leadData: any): string | null {
    // Ensure required fields are present
    if (!leadData.name || typeof leadData.name !== 'string') {
        return 'Name is required and should be a string';
    }
    if (!leadData.position || !['Current', 'Alumni'].includes(leadData.position)) {
        return 'Position is required and should be either "Current" or "Alumni"';
    }
    if (!leadData.organization || typeof leadData.organization !== 'string') {
        return 'Organization is required and should be a string';
    }
    if (!leadData.additionalInfo || typeof leadData.additionalInfo !== 'string') {
        return 'Additional info is required and should be a string';
    }
    if (!leadData.imageUrl || typeof leadData.imageUrl !== 'string') {
        return 'Image URL is required and should be a string';
    }
    return null; // No validation errors
}

export async function GET(request: Request) {
    try {
        const leadsRef = collection(db, "leads");
        const querySnapshot = await getDocs(leadsRef);
        const currentLeads: Lead[] = [];
        const alumniLeads: Lead[] = [];

        querySnapshot.forEach((doc) => {
            const leadData = doc.data() as Lead;
            if (leadData.position === "Current") {
                currentLeads.push({ ...leadData, id: doc.id });
            } else {
                alumniLeads.push({ ...leadData, id: doc.id });
            }
        });
        return NextResponse.json({ currentLeads, alumniLeads }, { status: 200 });

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
    try {
        const leadData = await request.json();

        // Validate incoming lead data
        const validationError = validateLeadData(leadData);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        const leadID = uuidv4();
        await setDoc(doc(db, "leads", leadID), {
            ...leadData,
            imageUrl: leadData.imageUrl, // Use the imageUrl from Firebase Storage
        });
        return NextResponse.json({ id: leadID }, { status: 201 });
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

export async function PUT(request: Request) {
    try {
        const leadData = await request.json();
        const { imageUrl } = leadData;
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Lead ID is required" },
                { status: 400 }
            );
        }

        // Validate incoming lead data
        const validationError = validateLeadData(leadData);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        await updateDoc(doc(db, "leads", id), {
            ...leadData,
            imageUrl: imageUrl, 
        });
        return NextResponse.json({ id: id }, { status: 200 });

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

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Lead ID is required" },
                { status: 400 }
            );
        }

        await deleteDoc(doc(db, "leads", id));
        return NextResponse.json({ id: id }, { status: 200 });
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
