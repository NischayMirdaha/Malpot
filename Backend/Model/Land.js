// models/Land.js
import mongoose from "mongoose";

const landSchema = new mongoose.Schema({
  landId: { type: String, unique: true },
  kittaNo: String,
  area: String,
  location: {
    district: String,
    ward: String
  },
  landType: String,

  owner: {
    name: String,
    citizenshipNo: String
  },

  transferHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OwnershipTransfer"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Land", landSchema);
