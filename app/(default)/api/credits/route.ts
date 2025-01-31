import connectMongoDB from "@/lib/dbConnect";
import Credit from "@/models/Credit";

/**
 * @swagger
 * /api/credit:
 *   get:
 *     summary: Retrieve all credits
 *     description: Fetches all stored contributor credits from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of credits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 credits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       githubUrl:
 *                         type: string
 *                         format: uri
 *                       imageUrl:
 *                         type: string
 *                         format: uri
 *       500:
 *         description: Internal server error
 */

export async function GET() {
  try {
    await connectMongoDB();

    const credits = await Credit.find();

    return new Response(JSON.stringify({ success: true, credits }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
