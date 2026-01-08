// models/LandTax.js
import mongoose from "mongoose";

const landTaxSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Land",
    required: true
  },
  taxYear: {
    type: Number,
    required: true
  },
  landType: {
    type: String,
    enum: ["Residential", "Agricultural", "Commercial"],
    required: true
  },
  area: {
    type: Number, // sq meter or ropani
    required: true
  },
  location: {
    district: String,
    ward: String
  },
  taxRate: {
    type: Number,
    required: true
  },
  totalTax: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Pending"],
    default: "Unpaid"
  },
  paidAt: Date,
  receiptUrl: String
}, { timestamps: true });

export default mongoose.model("LandTax", landTaxSchema);
