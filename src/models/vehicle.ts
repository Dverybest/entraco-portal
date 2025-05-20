import mongoose, { Document, Schema, models } from "mongoose";

const vehicleSchema: Schema = new Schema(
  {
    capacity: { type: String, required: true },
    chassisNumber: { type: String, required: true },
    engineNumber: { type: String, required: true, unique: true },
    fuelType: { type: String, required: true },
    issuingState: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    vehiclePhotoUrl: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    yearOfManufacture: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "Owner" },
    driver: { type: Schema.Types.ObjectId, ref: "Driver" },
    route: { type: Schema.Types.ObjectId, ref: "RouteAssignment" },
  },
  { timestamps: true }
);

export const Vehicle =
  models.Vehicle ||
  mongoose.model<IVehicleInfo & Document>("Vehicle", vehicleSchema);
