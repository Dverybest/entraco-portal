import mongoose, { Schema, models } from "mongoose";

const RouteAssignmentSchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    routeName: { type: String, required: true },
    shortCode: { type: String, required: true },
    registrationNo: { type: String, required: false },
  },
  { timestamps: true }
);

export const RouteAssignment =
  models.RouteAssignment ||
  mongoose.model("RouteAssignment", RouteAssignmentSchema);
