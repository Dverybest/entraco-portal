import mongoose, { Schema, models, Document } from "mongoose";

interface IRouteAssignment extends Document {
  stateCode: string;
  route: string;
  routeCode: string;
  registrationNo?: string;
  state: string;
}
const routeAssignmentSchema = new Schema<IRouteAssignment>(
  {
    state: { type: String, required: true },
    stateCode: { type: String, required: true },
    route: { type: String, required: true },
    routeCode: { type: String, required: true },
    registrationNo: { type: String, required: false },
  },
  { timestamps: true }
);

export const RouteAssignment =
  models.RouteAssignment ||
  mongoose.model<IRouteAssignment>("RouteAssignment", routeAssignmentSchema);
