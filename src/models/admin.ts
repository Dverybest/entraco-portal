import mongoose, { Document, Schema, models } from "mongoose";

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  isActive?: boolean;
  role: "admin" | "super_admin";
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
