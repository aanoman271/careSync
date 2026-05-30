import dbConnect from "@/lib/mongodb";
import Doctor from "@/Models/Doctor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    const doctorDetails = await Doctor.findById(id).populate({
      path: "userId",
      select: "name email image phone",
    });

    if (!doctorDetails) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctorDetails, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
