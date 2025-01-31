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
export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the form data from the incoming request
    const formData = await request.formData();

    // Retrieve the uploaded file from the form data
    const image: File | null = formData.get("file") as File;

    // Validate if a file was uploaded
    if (!image) {
      return NextResponse.json(
        {
          message: "Bad Request",
          details: "No file uploaded",
        },
        { status: 400 } // HTTP 400 Bad Request
      );
    }

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
            { folder: "members" }, // Optional: specify a folder in Cloudinary
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
