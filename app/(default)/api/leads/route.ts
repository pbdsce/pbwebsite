import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import Leadsmodel from "@/models/Leads";

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
  if (!leadData.position || !["Current", "Alumni"].includes(leadData.position)) {
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
 *     responses:
 *       201:
 *         description: Successfully created lead
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating lead
 */
export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    const validationError = validateLeadData(leadData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    const leadID: string = uuidv4();
    const newLead = new Leadsmodel({ id: leadID, ...leadData });
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
export async function PUT(request: Request) {
  try {
    const leadData = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }
    const user = await Leadsmodel.findOne({ id });
    if (!user) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const updatedLead = await Leadsmodel.findOneAndUpdate(
      { _id: user._id },
      { ...leadData },
      { new: true }
    );
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

/**
 * @swagger
 * /api/leads:
 *   delete:
 *     summary: Remove an existing lead
 *     description: Deletes a lead based on the provided ID.
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
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }
    const deletedLead = await Leadsmodel.findOneAndDelete({ id });
    if (!deletedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      {
        error: "An error occurred while deleting the lead",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
