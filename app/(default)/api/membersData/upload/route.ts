import { NextResponse } from "next/server";
import { Readable } from "stream";
import { cloudinary } from "@/Cloudinary";
import { UploadApiResponse } from "cloudinary";

/**
 * Handles file uploads and uploads the file to Cloudinary.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<Response>} - A response containing the uploaded image URL or an error message
 */
/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image file to Cloudinary
 *     description: This endpoint handles image file uploads and uploads the file to Cloudinary.
 *     tags:
 *      - Members
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded.
 *               name:
 *                 type: string
 *                 description: The name to use for the uploaded file.
 *               existingUrl:
 *                 type: string
 *                 description: The URL of an existing image to be replaced.
 *     responses:
 *       200:
 *         description: Successfully uploaded the image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: The secure URL of the uploaded image
 *       400:
 *         description: Bad request, no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request"
 *                 details:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Internal server error during upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cloudinary Upload Failed"
 *                 details:
 *                   type: string
 *                   example: "Unknown upload error"
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the form data from the incoming request
    const formData = await request.formData();

    // Retrieve the uploaded file from the form data
    const image: File | null = formData.get("file") as File;
    const name: string | null = formData.get("name") as string;
    const existingUrl: string | null = formData.get("existingUrl") as string;

    // Validate if a file was uploaded
    if (!image || !name) {
      return NextResponse.json(
        {
          message: "Bad Request",
          details: "No file uploaded",
        },
        { status: 400 } // HTTP 400 Bad Request
      );
    }

    // If there's an existing image, extract its public_id and delete it
    if (existingUrl) {
      try {
        const publicId = existingUrl.split('/').slice(-1)[0].split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`pbmembers/${publicId}`);
        }
      } catch (deleteError) {
        console.error("Error deleting existing image:", deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Generating a unique public_id using the name and timestamp
    const uniquePublicId = `${name}-${Date.now()}`;

    // Convert the uploaded file (File object) to a Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a readable stream from the Buffer
    const stream = Readable.from(buffer);

    try {
      // Upload the image to Cloudinary
      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: "pbmembers", 
              public_id: uniquePublicId,
              overwrite: false // Prevent accidental overwrites
            },
            (error, result) => {
              if (error || !result) {
                reject(error); // Handle upload errors
              } else {
                resolve(result); // Resolve with the upload result
              }
            }
          );

          // Pipe the readable stream into the Cloudinary upload stream
          stream.pipe(uploadStream);
        }
      );

      // Return the secure URL of the uploaded image as the response
      return NextResponse.json({
        imageUrl: uploadResult.secure_url,
      });
    } catch (uploadError) {
      // Log and handle errors during the Cloudinary upload process
      console.error("Cloudinary upload error:", uploadError);
      return NextResponse.json(
        {
          message: "Cloudinary Upload Failed",
          details:
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown upload error",
        },
        { status: 500 } // HTTP 500 Internal Server Error
      );
    }
  } catch (parseError) {
    // Log and handle errors while parsing form data
    console.error("Error parsing form data:", parseError);
    return NextResponse.json(
      {
        message: "Invalid Request",
        details:
          parseError instanceof Error
            ? parseError.message
            : "Unable to process request",
      },
      { status: 400 } // HTTP 400 Bad Request
    );
  }
}
