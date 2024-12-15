import { db } from "@/Firebase";
import {
    getDocs,
    collection,
    updateDoc,
    doc,
    deleteDoc,
    setDoc
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

// Helper function to validate event data
const validateEvent = (event: any) => {
    const errors: string[] = [];
    const { eventName, eventDate, lastDateOfRegistration, description, imageURL, registrationLink } = event;

    if (!eventName || typeof eventName !== "string" || eventName.trim().length === 0) {
        errors.push("Event name is required and must be a non-empty string.");
    }

    if (!eventDate || isNaN(Date.parse(eventDate))) {
        errors.push("Event date is required and must be a valid date.");
    }

    if (!lastDateOfRegistration || isNaN(Date.parse(lastDateOfRegistration))) {
        errors.push("Last date of registration is required and must be a valid date.");
    } else if (new Date(lastDateOfRegistration) > new Date(eventDate)) {
        errors.push("Last date of registration must be before the event date.");
    }

    if (!description || typeof description !== "string" || description.trim().length < 10) {
        errors.push("Description is required and must be at least 10 characters long.");
    }

    if (!imageURL || typeof imageURL !== "string" || !imageURL.startsWith("http")) {
        errors.push("Image URL is required and must be a valid URL.");
    }

    if (!registrationLink || typeof registrationLink !== "string" || !registrationLink.startsWith("http")) {
        errors.push("Registration link is required and must be a valid URL.");
    }

    return errors;
};

// GET request
export async function GET(request: Request) {
    try {
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        const data = eventSnapshot.docs.map((doc) => doc.data());
        const eventsList = data.map((event: any) => ({
            id: event.id,
            eventName: event.eventName,
            description: event.description,
            eventDate: event.eventDate,
            lastDateOfRegistration: event.lastDateOfRegistration,
            dateCreated: event.dateCreated,
            dateModified: event.dateModified,
            imageURL: event.imageURL,
            registrationLink: event.registrationLink,
        }));

        return NextResponse.json({ events: eventsList }, { status: 200 });
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

// POST request
export async function POST(request: Request) {
    try {
        const newEvent = await request.json();
        const validationErrors = validateEvent(newEvent);

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { error: "Validation failed", details: validationErrors },
                { status: 400 }
            );
        }

        const eventId = uuidv4();
        const currentDate = new Date().toISOString();
        const { eventName, eventDate, lastDateOfRegistration, description, imageURL, registrationLink } = newEvent;

        await setDoc(doc(db, "events", eventId), {
            id: eventId,
            eventName,
            eventDate,
            lastDateOfRegistration,
            description,
            imageURL,
            registrationLink,
            dateCreated: currentDate,
            dateModified: currentDate,
        });

        return NextResponse.json({ id: eventId }, { status: 201 });
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

// PUT request
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventid = searchParams.get("eventid");

        if (!eventid) {
            return NextResponse.json(
                { error: "Event ID is required" },
                { status: 400 }
            );
        }

        const updatedEvent = await request.json();
        const validationErrors = validateEvent(updatedEvent);

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { error: "Validation failed", details: validationErrors },
                { status: 400 }
            );
        }

        await updateDoc(doc(db, "events", eventid), {
            ...updatedEvent,
            dateModified: new Date().toISOString(),
        });

        return NextResponse.json({ id: eventid }, { status: 200 });
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

// DELETE request
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventid = searchParams.get("eventid");

        if (!eventid) {
            return NextResponse.json(
                { error: "Event ID is required" },
                { status: 400 }
            );
        }

        await deleteDoc(doc(db, "events", eventid));
        return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
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
