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

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Fetch all leads
 *     description: This endpoint fetches all leads, divided into current leads and alumni leads.
 *     tags:
 *       - Leads
 *     responses:
 *       200:
 *         description: Successfully fetched leads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentLeads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "4e6b1c2d-8f8a-4b56-9f52-5c8f9a67e079"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       position:
 *                         type: string
 *                         example: "Current"
 *                       organization:
 *                         type: string
 *                         example: "XYZ Organization"
 *                       additionalInfo:
 *                         type: string
 *                         example: "Lead in Data Science"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                 alumniLeads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "4e6b1c2d-8f8a-4b56-9f52-5c8f9a67e080"
 *                       name:
 *                         type: string
 *                         example: "Jane Smith"
 *                       position:
 *                         type: string
 *                         example: "Alumni"
 *                       organization:
 *                         type: string
 *                         example: "ABC Corporation"
 *                       additionalInfo:
 *                         type: string
 *                         example: "Former Lead in Marketing"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching leads"
 */

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Add a new lead
 *     description: This endpoint allows adding a new lead with the required data.
 *     tags:
 *       - Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               position:
 *                 type: string
 *                 enum: ["Current", "Alumni"]
 *                 example: "Current"
 *               organization:
 *                 type: string
 *                 example: "XYZ Organization"
 *               additionalInfo:
 *                 type: string
 *                 example: "Lead in Data Science"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Successfully created lead
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "4e6b1c2d-8f8a-4b56-9f52-5c8f9a67e079"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 position:
 *                   type: string
 *                   example: "Current"
 *                 organization:
 *                   type: string
 *                   example: "XYZ Organization"
 *                 additionalInfo:
 *                   type: string
 *                   example: "Lead in Data Science"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Position is required and should be either 'Current' or 'Alumni'"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while creating the lead"
 */

/**
 * @swagger
 * /api/leads:
 *   put:
 *     summary: Update an existing lead
 *     description: This endpoint allows updating an existing lead by its ID.
 *     tags:
 *       - Leads
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "4e6b1c2d-8f8a-4b56-9f52-5c8f9a67e079"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               position:
 *                 type: string
 *                 enum: ["Current", "Alumni"]
 *                 example: "Current"
 *               organization:
 *                 type: string
 *                 example: "XYZ Organization"
 *               additionalInfo:
 *                 type: string
 *                 example: "Lead in Data Science"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Successfully updated lead
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "4e6b1c2d-8f8a-4b56-9f52-5c8f9a67e079"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 position:
 *                   type: string
 *                   example: "Current"
 *                 organization:
 *                   type: string
 *                   example: "XYZ Organization"
 *                 additionalInfo:
 *                   type: string
 *                   example: "Lead in Data Science"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lead ID is required"
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lead not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while updating the lead"
 */

/**
 * @swagger
 * /api/leads:
 *   delete:
 *     summary: Delete an existing lead
 *     description: This endpoint allows deleting a lead by its ID.
 *     tags:
 *       - Leads
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "4e6b1c2d-8f8a-4b56-9f52-5c8f9a67e079"
 *     responses:
 *       200:
 *         description: Successfully deleted lead
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "4e6b1c2d-8f8a-4b56-9f52-5c8f9a67e079"
 *       400:
 *         description: Lead ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lead ID is required"
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lead not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while deleting the lead"
 */

