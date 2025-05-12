// src/app/api/seed/route.ts
import connectDB from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import Admin from "@/models/admin";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to DB
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "entraco-admin@yopmail.com",
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists." });
    }

    const user = await Admin.create({
      firstName: "Entraco",
      lastName: "Admin",
      role: "super_admin",
      email: "entraco-admin@yopmail.com",
      password: await hashPassword("@Example1"),
    });

    await user.save();
    return NextResponse.json({ message: "Admin account seeded!" });
  } catch (err) {
    console.error("Error seeding data:", err);
    return NextResponse.json({
      message: "Error seeding data.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  } finally {
    mongoose.disconnect();
  }
}
