import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Invoice } from "tranzakt-node-sdk";
import mongoose from "mongoose";
import { Counter, Payment, RouteAssignment, Vehicle } from "@/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body", body);

    const {
      data: { id },
    } = body as { data: Invoice };

    await connectDB();
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const payment = await Payment.findOne({ invoiceId: id }, null, {
        session,
      });
      if (!payment) {
        console.error("payment not found");
        return NextResponse.json({ success: true });
      }
      await Payment.findByIdAndUpdate(
        payment._id,
        { status: "paid" },
        { session }
      );
      console.log({ payment });

      const vehicle = await Vehicle.findById(payment.vehicle, null, {
        session,
      });
      if (!vehicle) {
        console.error("vehicle not found");
        return NextResponse.json({ success: true });
      }
      const route = await RouteAssignment.findById(vehicle.route, null, {
        session,
      });
      if (!route) {
        console.error("route not found");
        return NextResponse.json({ success: true });
      }
      const number = await getNextCounter("registration");
      const registrationNo = `${route?.stateCode}/${route.routeCode}/${number}`;
      await RouteAssignment.findByIdAndUpdate(route._id, { registrationNo });
      await session.commitTransaction();
      return NextResponse.json({ success: true });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ success: true });
  }
}

async function getNextCounter(name: string, length = 7) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  // Pad the number with leading zeros to match desired length (e.g., 7 digits)
  return String(counter.value).padStart(length, "0"); // e.g., "0001001"
}
