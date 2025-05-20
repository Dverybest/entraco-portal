import connectDB from "@/lib/db";
import { Payment } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const payment = await Payment.findOne({ invoiceId: id }).populate(
      "vehicle"
    );

    if (!payment) {
      return NextResponse.json({ error: "payment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error("GET /vehicles/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
