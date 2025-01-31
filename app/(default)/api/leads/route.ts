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

    console.log("New lead instance:", newLead);

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
// PUT method: Update an existing lead
export async function PUT(request: Request) {
  try {
    const leadData = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await Leadsmodel.findOne({ id });
    const _id = user._id;
    console.log(_id);
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
    console.log(updatedLead);
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
