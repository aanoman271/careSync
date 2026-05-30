import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();

    return Response.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Database connection failed",
    });
  }
}
