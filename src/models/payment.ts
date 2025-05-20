import mongoose, { Document, Schema, models } from "mongoose";

interface IPayment extends Document {
  invoiceId: string;
  status: "paid" | "unpaid";
  vehicle: Schema.Types.ObjectId;
  amount: number;
}
const paymentSchema = new Schema<IPayment>(
  {
    invoiceId: { type: String, required: true },
    status: { type: String, required: true, default: "unpaid" },
    amount: { type: Number, required: true },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment =
  models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);
