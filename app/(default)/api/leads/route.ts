import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import Leadsmodel from "@/models/Leads";
import { cloudinary } from '@/Cloudinary';

// Interface for Lead
interface Lead {
  id: string;
  name: string;
  position: string;
  organization: string;
  additionalInfo: string;
  imageUrl: string;
}

// Validation function for lead data
function validateLeadData(leadData: any): string | null {
  if (!leadData.name || typeof leadData.name !== "string") {
    return "Name is required and should be a string";
  }
  if (
    !leadData.position ||
    !["Current", "Alumni"].includes(leadData.position)
  ) {
    return 'Position is required and should be either "Current" or "Alumni"';
  }
  if (!leadData.organization || typeof leadData.organization !== "string") {
    return "Organization is required and should be a string";
  }
  if (!leadData.additionalInfo || typeof leadData.additionalInfo !== "string") {
    return "Additional info is required and should be a string";
  }
  if (!leadData.imageUrl || typeof leadData.imageUrl !== "string") {
    return "Image URL is required and should be a string";
  }
  return null;
}
/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Fetch all leads
 *     description: Retrieves a list of all current and alumni leads.
 *     tags:
 *      - Leads
 *     responses:
 *       200:
 *         description: Successfully retrieved leads
 *       500:
 *         description: Error fetching leads
 */
export async function GET(request: Request) {
  try {
    await connectMongoDB();
    const leads = await Leadsmodel.find();
    const currentLeads: Lead[] = [];
    const alumniLeads: Lead[] = [];

    leads.forEach((lead) => {
      if (lead.position === "Current") {
        currentLeads.push(lead);
      } else {
        alumniLeads.push(lead);
      }
    });

    return NextResponse.json({ currentLeads, alumniLeads }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching leads",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Add a new lead
 *     description: Creates a new lead and stores it in the database.
 *     tags:
 *      - Leads
 *     responses:
 *       201:
 *         description: Successfully created lead
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating lead
 */
// POST method: Add a new lead
export async function POST(request: Request) {
  try {
    const leadData = await request.json();

    const validationError = validateLeadData(leadData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const leadID: string = uuidv4();

    const newLead = new Leadsmodel({
      id: leadID,
      ...leadData,
    });

    const savedLead = await newLead.save();
    return NextResponse.json(savedLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      {
        error: "An error occurred while creating the lead",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/leads:
 *   put:
 *     summary: Update an existing lead
 *     description: Updates an existing lead based on the provided ID.
 *     tags:
 *      - Leads
 *     responses:
 *       200:
 *         description: Successfully updated lead
 *       400:
 *         description: Validation error or missing ID
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Error updating lead
 */
// PUT method: Update an existing lead
export async function PUT(request: Request) {
  try {
    const leadData = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await Leadsmodel.findOne({ id });
    const _id = user._id;
    
    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 }
      );
    }

    // Validate the incoming lead data
    const validationError = validateLeadData(leadData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updatedLead = await Leadsmodel.findOneAndUpdate(
      { _id },
      { ...leadData },
      { new: true }
    );
    
    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      {
        error: "An error occurred while updating the lead",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// DELETE method: Remove an existing lead
/**
 * @swagger
 * /api/leads:
 *   delete:
 *     summary: Remove an existing lead
 *     description: Deletes a lead based on the provided ID.
 *     tags:
 *      - Leads
 *     responses:
 *       200:
 *         description: Successfully deleted lead
 *       400:
 *         description: Missing ID
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Error deleting lead
 */
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

    const deletedLead = await Leadsmodel.findOne({ id });
    
    if (!deletedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // If there's an image URL, delete it from Cloudinary
    if (deletedLead.imageUrl) {
      try {
        // Extract the filename from URL
        const urlParts = deletedLead.imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1].split('.')[0];
        
        // Format the public ID as shown in your console
        const publicId = `leads/${deletedLead.name}-${filename.split('-').pop()}`;
        
        // Delete the image
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary delete result:", result);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with lead deletion even if image deletion fails
      }
    }

    await Leadsmodel.deleteOne({ id });
    return NextResponse.json(
      { message: "Lead deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting lead:", error.message);
      return NextResponse.json(
        { error: "An error occurred while deleting the lead", details: error.message },
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