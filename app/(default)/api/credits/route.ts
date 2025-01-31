import connectMongoDB from "@/lib/dbConnect";
import Credit from "@/models/Credit";

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
