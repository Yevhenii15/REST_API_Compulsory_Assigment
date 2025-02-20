import { Schema, model } from "mongoose";
import { Cat } from "../interfaces/cat";

const catSchema = new Schema<Cat>({
  name: { type: String, required: true, min: 3, max: 15 },
  age: { type: Number, required: true, min: 0, max: 30 },
  breed: { type: String, required: true, min: 3, max: 50 },
  color: { type: String, required: true, min: 3, max: 50 },
  weight: { type: Number, required: true, min: 0, max: 30 },
  isVaccinated: { type: Boolean, required: true },
  birthDate: { type: Date, required: true },
  _owner: { type: String, ref: "Owner", required: true },
});

export const catModel = model<Cat>("Cat", catSchema);
