import mongoose, { Schema } from "mongoose";

const consultSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    symptoms: { type: String, required: true },
    specialist: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
    },
    doctor: {
      type: Schema.Types.ObjectId,  //req.user?._id,
      ref: "Doctor",
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

consultSchema.index(
  { completedAt: 1 },
  { expireAfterSeconds: 2 * 24 * 60 * 60 }
);

export const Consult = mongoose.model("Consult", consultSchema);
