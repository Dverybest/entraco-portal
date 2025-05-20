import connectDB from "@/lib/db";
import { Vehicle } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const vehicles = await Vehicle.find({}).populate("owner driver route");
    return NextResponse.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.log("GET /vehicles/[id] error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
