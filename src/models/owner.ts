import { Gender } from "@/types/gender";
import mongoose, { Document, Schema, models } from "mongoose";

const ownerSchema = new Schema<IOwnerInfo & Document>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    gender: { type: String, enum: Gender, required: true },
    idNumber: { type: String, required: true },
    lga: { type: String, required: true },
    idDocumentUrl: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

export const Owner =
  models.Owner || mongoose.model<IOwnerInfo & Document>("Owner", ownerSchema);
