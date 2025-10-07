import mongoose, { Schema } from "mongoose";

const prescriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    prescription: {
      type: String,
      required: true,
    },

    doctor: {
      type: Schema.Types.ObjectId, //req.user?._id,
      ref: "Doctor",
    },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
