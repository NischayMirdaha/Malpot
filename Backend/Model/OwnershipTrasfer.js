// models/OwnershipTransfer.js
import mongoose from "mongoose";

const ownershipTransferSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Land",
    required: true
  },
  previousOwner: {
    name: String,
    citizenshipNo: String
  },
  newOwner: {
    name: String,
    citizenshipNo: String
  },
  documents: {
    citizenship: String,   // Cloudinary URL
    saleDeed: String,
    taxClearance: String
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  verifiedAt: Date
}, { timestamps: true });

export default mongoose.model(
  "OwnershipTransfer",
  ownershipTransferSchema
);
