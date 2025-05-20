// models/Counter.ts
import mongoose, { Schema, Document } from "mongoose";

interface ICounter extends Document {
  name: string;
  value: number;
}
const counterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true }, // e.g., "vehicleId"
  value: { type: Number, required: true, default: 1000 }, // initial as 0001000
});

export const Counter =
  mongoose.models.Counter || mongoose.model<ICounter>("Counter", counterSchema);
