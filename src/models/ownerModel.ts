import { Schema, model } from "mongoose";
import { Owner } from "../interfaces/owner";

const ownerSchema = new Schema<Owner>({
  name: { type: String, required: true, min: 3, max: 50 },
  email: { type: String, required: true, unique: true, min: 5, max: 255 },
  password: { type: String, required: true, min: 8, max: 255 },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ownerModel = model<Owner>("Owner", ownerSchema);
