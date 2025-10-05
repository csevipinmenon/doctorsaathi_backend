import mongoose, { Schema } from "mongoose";

const PatientContSchema = new Schema(
  {
    doctorEmail: {
      type: String,
      required: true,
    },
    count: String,
  },

  { timestamps: true }
);

export const PatientConsult = mongoose.model(
  "PatientConsult",
  PatientContSchema
);
