import mongoose from "mongoose";

const landSchema = new mongoose.Schema(
  {
    landId: {
      type: String,
      unique: true
    },

    kittaNumber: {
      type: String,
      required: true
    },

    area: {
      type: Number,
      required: true
    },

    areaUnit: {
      type: String,
      enum: ["sq_meter", "ropani"],
      required: true
    },

    district: {
      type: String,
      required: true
    },

    ward: {
      type: Number,
      required: true
    },

    landType: {
      type: String,
      enum: ["Residential", "Agricultural", "Commercial"],
      required: true
    },

    ownershipDocument: {
      public_id: String,
      url: String
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// Auto-generate Land ID before save
landSchema.pre("save", function (next) {
  if (!this.landId) {
    this.landId = `LAND-${Date.now()}`;
  }
  next();
});

export default mongoose.model("Land", landSchema);
