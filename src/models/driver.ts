import { Gender } from "@/types/gender";
import { IssuingAuthority } from "@/types/issuing-authority.enum";
import { LicenseClass } from "@/types/license-class.enum";
import mongoose, { Schema, Document, models } from "mongoose";

const driverInformationSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: Gender, required: true },
    nationality: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    residentialAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    nin: { type: String, required: true },
    validIdUrl: { type: String, required: true },
    passportUrl: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseClass: {
      type: String,
      enum: LicenseClass,
      required: true,
    },
    issuingAuthority: {
      type: String,
      enum: IssuingAuthority,
      required: true,
    },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    licenseUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const Driver =
  models.Driver ||
  mongoose.model<IDriverInformation & Document>(
    "Driver",
    driverInformationSchema
  );
