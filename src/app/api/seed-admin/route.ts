import connectDB from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import Admin from "@/models/admin";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Connect to DB
    await connectDB();

    const { firstName, lastName, email, password, role } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json(
        { message: "Role must be either 'admin' or 'super_admin'" },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists." },
        { status: 400 }
      );
    }

    const user = await Admin.create({
      firstName,
      lastName,
      role,
      email,
      password: await hashPassword(password),
    });

    await user.save();
    return NextResponse.json({ message: "Admin account created successfully!" });
  } catch (err) {
    console.error("Error creating admin:", err);
    return NextResponse.json(
      {
        message: "Error creating admin account.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    mongoose.disconnect();
  }
} 