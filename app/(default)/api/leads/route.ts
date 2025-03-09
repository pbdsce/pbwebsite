import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/lib/dbConnect";
import Leadsmodel from "@/models/Leads";
import { cloudinary } from '@/Cloudinary';
import { convertToWebP } from "@/utils/webpImages"; 


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
      // Convert image URLs to WebP
      if (lead.imageUrl) {
        lead.imageUrl = convertToWebP(lead.imageUrl);
      }

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

    // If image URL is provided, upload it to Cloudinary and convert to WebP
    if (leadData.imageUrl) {
      try {
        const uploadResult = await cloudinary.uploader.upload(leadData.imageUrl, {
          folder: "leads_images",
          public_id: leadID,
          format: "webp", // Force Cloudinary to return WebP image
        });

        newLead.imageUrl = convertToWebP(uploadResult.secure_url); // Ensure WebP URL format
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }
    }

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

    // If the image is updated, upload it to Cloudinary and convert to WebP
    if (leadData.imageUrl) {
      try {
        const uploadResult = await cloudinary.uploader.upload(leadData.imageUrl, {
          folder: "leads_images",
          public_id: updatedLead.id, // Use the same public_id
          format: "webp", // Force Cloudinary to return WebP image
        });

        updatedLead.imageUrl = convertToWebP(uploadResult.secure_url); // Ensure WebP URL format
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }
    }

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
        const matches = deletedLead.imageUrl.match(/\/v\d+\/(.+?)\./);
        const publicId = matches ? matches[1] : null;

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        } else {
          console.warn("Could not extract public ID from URL:", deletedLead.imageUrl);
        }
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
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