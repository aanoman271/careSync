import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/Models/User";
import Doctor from "@/Models/Doctor";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    //  Database connect
    await dbConnect();

    //  Form  data
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      gender,
      image,
      specialization,
      experience,
      hospital,
      qualification,
      consultationFee,
      availableSlots,
    } = body;

    // field validation
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !gender ||
      !specialization ||
      !experience ||
      !hospital ||
      !qualification ||
      !consultationFee
    ) {
      return NextResponse.json(
        { message: "fill the all required filds" },
        { status: 400 },
      );
    }

    // existing email validation
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "this email already used" },
        { status: 409 },
      );
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // User save
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      image: image || "",
      role: "doctor",
    });

    // Doctor s extra information
    await Doctor.create({
      userId: user._id, // User এর সাথে link
      specialization,
      experience: Number(experience),
      hospital,
      qualification,
      consultationFee: Number(consultationFee),
      availableSlots: availableSlots || [],
      rating: 0,
      verified: false,
    });

    return NextResponse.json(
      {
        message:
          "Doctor account created!if Admin approved then you will able to active ",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Doctor registration error:", error);
    return NextResponse.json(
      { message: "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করো", error: error.message },
      { status: 500 },
    );
  }
}
