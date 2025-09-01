import { NextResponse } from "next/server";
import Eventmodel from "@/models/Events";
import connectMongoDB from "@/lib/dbConnect";
import { v4 as uuidv4 } from "uuid";
import { cloudinary } from '@/Cloudinary';
import { requireAuth } from "@/lib/requireAuth";
/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve all events
 *     description: Fetches all stored events from the database.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       eventName:
 *                         type: string
 *                       description:
 *                         type: string
 *                       eventDate:
 *                         type: string
 *                         format: date
 *                       lastDateOfRegistration:
 *                         type: string
 *                         format: date
 *                       dateCreated:
 *                         type: string
 *                         format: date-time
 *                       dateModified:
 *                         type: string
 *                         format: date-time
 *                       imageURL:
 *                         type: string
 *                         format: uri
 *                       registrationLink:
 *                         type: string
 *                         format: uri
 *       500:
 *         description: Internal server error
 */
// Helper function to validate event data
const validateEvent = (event: any) => {
  const errors: string[] = [];
  const {
    eventName,
    eventDate,
    lastDateOfRegistration,
    description,
    imageURL,
    registrationLink,
  } = event;

  if (
    !eventName ||
    typeof eventName !== "string" ||
    eventName.trim().length === 0
  ) {
    errors.push("Event name is required and must be a non-empty string.");
  }

  if (!eventDate || isNaN(Date.parse(eventDate))) {
    errors.push("Event date is required and must be a valid date.");
  }

  if (!lastDateOfRegistration || isNaN(Date.parse(lastDateOfRegistration))) {
    errors.push(
      "Last date of registration is required and must be a valid date."
    );
  } else if (new Date(lastDateOfRegistration) > new Date(eventDate)) {
    errors.push("Last date of registration must be before the event date.");
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    errors.push(
      "Description is required and must be at least 10 characters long."
    );
  }

  if (
    !imageURL ||
    typeof imageURL !== "string" ||
    !imageURL.startsWith("http")
  ) {
    errors.push("Image URL is required and must be a valid URL.");
  }

  if (
    !registrationLink ||
    typeof registrationLink !== "string" ||
    !registrationLink.startsWith("http")
  ) {
    errors.push("Registration link is required and must be a valid URL.");
  }

  return errors;
};
/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Adds a new event to the database.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               lastDateOfRegistration:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               imageURL:
 *                 type: string
 *                 format: uri
 *               registrationLink:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Successfully created an event.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
// GET request
export async function GET(request: Request) {
  await connectMongoDB();
  try {
    
    const eventSnapshot = await Eventmodel.find();
    const eventsList = eventSnapshot.map((event: any) => ({
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
/**
 * @swagger
 * /api/events:
 *   put:
 *     summary: Update an existing event
 *     description: Updates an event in the database based on event ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: eventid
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               lastDateOfRegistration:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               imageURL:
 *                 type: string
 *                 format: uri
 *               registrationLink:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       400:
 *         description: Validation error or missing event ID.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */
// POST request
export async function POST(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;
  
  try {
    const newEvent = await request.json();
    const validationErrors = validateEvent(newEvent);
    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }
    const eventId = uuidv4();
    const currentDate = new Date().toISOString();
    const newEventData = new Eventmodel({
      id: eventId,
      ...newEvent,
      dateCreated: currentDate,
      dateModified: currentDate,
    });
    const savedEvent = await newEventData.save();
    return NextResponse.json({ id: eventId }, { status: 201 });
  } catch (error) {
    console.error("Error occurred during event creation:", error);
    return NextResponse.json(
      {
        error: "An error occurred while creating the event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/events:
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an event from the database based on event ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: eventid
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       400:
 *         description: Missing event ID.
 *       500:
 *         description: Internal server error.
 */
// PUT request
export async function PUT(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const eventid = searchParams.get("eventid");
    console.log(eventid);
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

    const result = await Eventmodel.findOneAndUpdate(
      { id: eventid },
      {
        $set: {
          ...updatedEvent,
          dateModified: new Date().toISOString(),
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

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
  const { user, error } = await requireAuth(request)
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const eventid = searchParams.get("eventid");

    if (!eventid) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }
    const event = await Eventmodel.findOne({ id: eventid });
    
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // If there's an image URL, delete it from Cloudinary
    if (event.imageURL) {
      try {
        // Extract public_id from the Cloudinary URL
        const matches = event.imageURL.match(/\/v\d+\/(.+?)\./);
        const publicId = matches ? matches[1] : null;

        if (publicId) {
          console.log('Attempting to delete image with public ID:', publicId);
          const result = await cloudinary.uploader.destroy(publicId);
          console.log('Cloudinary deletion result:', result);
        } else {
          console.warn('Could not extract public ID from URL:', event.imageURL);
        }
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Log detailed error for debugging
        if (cloudinaryError instanceof Error) {
          console.error("Error details:", cloudinaryError.message);
        }
        // Continue with event deletion even if image deletion fails
      }
    }

    await Eventmodel.deleteOne({ id: eventid });
    return NextResponse.json(
      { message: "Event deleted successfully" },
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
