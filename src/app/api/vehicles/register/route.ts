import { NextRequest, NextResponse } from "next/server";
import { fullFormSchema } from "@/schemas/register.schema";
import { ZodError } from "zod";
import { Tranzakt } from "tranzakt-node-sdk";
import { Driver, Owner, Payment, RouteAssignment, Vehicle } from "@/models";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import { routes, states } from "@/utils";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    if (!bodyText || bodyText.trim() === "") {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }
    const body = JSON.parse(bodyText);
    const details = fullFormSchema.parse(body);

    await connectDB();
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const owner = await Owner.create([details.ownerInfo], { session });
      const driver = await Driver.create([details.driverInfo], { session });
      const { route, state, error } = validateRoute(
        details.routeInfo.state,
        details.routeInfo.routeCode
      );

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      const routeAssignment = await RouteAssignment.create(
        [
          {
            state: state?.name,
            stateCode: state?.code,
            route: route?.name,
            routeCode: route?.code,
          },
        ],
        { session }
      );
      const vehicle = await Vehicle.create(
        [
          {
            ...details.vehicleInfo,
            owner: owner[0]._id,
            driver: driver[0]._id,
            route: routeAssignment[0]._id,
          },
        ],
        { session }
      );

      const invoice = await createInvoice({
        payerEmail: details.ownerInfo.email,
        payerName: details.ownerInfo.name,
        vehicleId: vehicle[0]._id,
        payerPhoneNumber: details.ownerInfo.phoneNumber,
      });

      await Payment.create(
        [
          {
            invoiceId: invoice.data?.id,
            vehicle: vehicle[0]._id,
            amount: invoice.data?.amount,
          },
        ],
        { session }
      );
      await session.commitTransaction();
      return NextResponse.json({
        success: true,
        data: { paymentUrl: invoice.data?.paymentUrl },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

const validateRoute = (selectedState: string, code: string) => {
  const route = routes.find((route) => route.code === code);
  if (!route) {
    return { error: "Invalid Route code" };
  }
  const state = states.find((state) => state.name === selectedState);
  if (!state) {
    return { error: "Invalid State" };
  }
  return { route, state };
};
const createInvoice = async (data: {
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  vehicleId: string;
}) => {
  const secretKey = process.env.TRANZAKT_SECRET_KEY;
  const collectionId = process.env.TRANZAKT_COLLECTION_ID;
  if (!secretKey || !collectionId) {
    throw new Error("Secret key not found");
  }
  const tranzakt = new Tranzakt(secretKey);
  const invoice = await tranzakt.createInvoice({
    collectionId: collectionId,
    title: "Registration fee",
    amount: 2000,
    payerName: data.payerName,
    payerEmail: data.payerEmail,
    payerPhoneNumber: data.payerPhoneNumber,
    billerMetaData: {
      vehicleId: data.vehicleId,
    },
  });
  return invoice;
};
