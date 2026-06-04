import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/Models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    //  Database connect
    await dbConnect();

    const body = await req.json();
    const { name, email, password, phone, image, gender } = body;

    // field validation
    if (!name || !email || !password || !phone || !gender) {
      return NextResponse.json(
        { message: "all information required" },
        { status: 400 },
      );
    }

    //  validate existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "this email already exits" },
        { status: 409 },
      );
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    //  User save
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      image: image || "",
      gender,
      role: "patient",
    });

    return NextResponse.json(
      {
        message: "Account created",
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করো", error: error.message },
      { status: 500 },
    );
  }
}
