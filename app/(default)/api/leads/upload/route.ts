import { NextResponse } from "next/server";
import { Readable } from "stream";
import { cloudinary } from "@/Cloudinary";
import { UploadApiResponse } from "cloudinary";

// Assuming you have this function in an external file (import it here)
import { convertToWebP } from "@/utils/webpImages";

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
 *     summary: Uploads an image to Cloudinary.
 *     description: Receives an image file and uploads it to Cloudinary, returning the secure URL of the uploaded image.
 *     tags:
 *      - Upload
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
 *                 description: The desired name of the file in storage.
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/images/image.jpg"
 *       400:
 *         description: Bad request, file or name not provided.
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
 *                   example: "File and name are required"
 *       500:
 *         description: Internal server error during the upload process.
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
    // Check if the Content-Type header is multipart/form-data
    const contentType = request.headers.get("Content-Type");
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { message: "Bad Request", details: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    // Parse the form data from the incoming request
    const formData = await request.formData();

    // Retrieve the uploaded file from the form data
    const image: File | null = formData.get("file") as File;
    const name: string | null = formData.get("name") as string;

    // Validate if a file and name were uploaded
    if (!image || !name) {
      return NextResponse.json(
        { message: "Bad Request", details: "File and name are required" },
        { status: 400 } // HTTP 400 Bad Request
      );
    }

    // Optional: Validate file type (e.g., accept only images)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(image.type)) {
      return NextResponse.json(
        { message: "Bad Request", details: "Unsupported file type" },
        { status: 400 } // HTTP 400 Bad Request
      );
    }

    // Convert the uploaded file (File object) to a Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a readable stream from the Buffer
    const stream = Readable.from(buffer);

    try {
      // Upload the image to Cloudinary (including transformation to WebP)
      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "images", // Specify folder
              public_id: name,  // Use name as public ID
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

      // After upload, get the image URL and apply the WebP transformation
      let webpUrl = cloudinary.url(uploadResult.public_id, {
        transformation: [
          { width: 500, crop: "scale", format: "webp" } // Ensure the image is served in WebP format
        ]
      });

      // Apply the external `convertToWebP` function if required
      webpUrl = convertToWebP(webpUrl); // This ensures the URL is properly formatted

      // Cache busting: add a query string to force Cloudinary to regenerate the image
      const timestamp = new Date().getTime(); // Generate unique timestamp for cache busting
      webpUrl = `${webpUrl}?v=${timestamp}`; // Adding query parameter to bust cache

      // Return the final WebP URL with cache-busting as the response
      return NextResponse.json({
        imageUrl: webpUrl, // This will be the WebP URL with cache-busting
      });
    } catch (uploadError) {
      // Log and handle errors during the Cloudinary upload process
      console.error("Cloudinary upload error:", uploadError);
      return NextResponse.json(
        {
          message: "Cloudinary Upload Failed",
          details: uploadError instanceof Error ? uploadError.message : "Unknown upload error",
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
        details: parseError instanceof Error ? parseError.message : "Unable to process request",
      },
      { status: 400 } // HTTP 400 Bad Request
    );
  }
}
