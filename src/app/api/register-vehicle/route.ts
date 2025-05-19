// app/api/register-driver/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fullFormSchema } from "@/schemas/register.schema";
import { ZodError } from "zod";
import { Tranzakt } from "tranzakt-node-sdk";
import { Driver, Owner, Vehicle } from "@/models";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    // ✅ Check if body is empty
    if (!bodyText || bodyText.trim() === "") {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }
    const body = JSON.parse(bodyText);
    const secretKey = process.env.TRANZAKT_SECRET_KEY;
    const collectionId = process.env.TRANZAKT_COLLECTION_ID;
    if (!secretKey || !collectionId) {
      throw new Error("Secret key not found");
    }
    const registrationDetails = fullFormSchema.parse(body);
    const tranzakt = new Tranzakt(secretKey);
    const invoice = await tranzakt.createInvoice({
      collectionId: collectionId,
      title: "Registration fee",
      amount: 2000,
      payerName: registrationDetails.ownerInfo.name,
      payerEmail: registrationDetails.ownerInfo.email,
      payerPhoneNumber: registrationDetails.ownerInfo.phoneNumber,
      billerMetaData: {
        vehicle: registrationDetails.vehicleInfo.registrationNumber,
      },
    });

    await connectDB();
    const owner = await Owner.create(registrationDetails.ownerInfo);
    const driver = await Driver.create(registrationDetails.driverInfo);
    const vehicle = await Vehicle.create({
      ...registrationDetails.vehicleInfo,
      owner: owner._id,
      driver: driver._id,
    });
    console.log(vehicle);

    // Proceed with business logic using parsed.vehicleInfo, parsed.ownerInfo, parsed.driverInfo

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.log({ error });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
