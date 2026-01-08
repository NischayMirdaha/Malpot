// controllers/landTaxController.js
import LandTax from "../models/LandTax.js";
import Land from "../models/Land.js";
import { calculateTaxRate } from "../utils/taxCalculator.js";
import generateTaxReceipt from "../utils/generateTaxReceipt.js";

// Generate annual tax
export const generateLandTax = async (req, res) => {
  try {
    const land = await Land.findById(req.params.landId);
    if (!land) return res.status(404).json({ message: "Land not found" });

    const taxRate = calculateTaxRate(
      land.landType,
      land.location.district
    );

    const totalTax = taxRate * Number(land.area);

    const tax = await LandTax.create({
      landId: land._id,
      taxYear: new Date().getFullYear(),
      landType: land.landType,
      area: land.area,
      location: land.location,
      taxRate,
      totalTax
    });

    res.status(201).json({
      success: true,
      tax
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark tax as paid & generate receipt
export const payLandTax = async (req, res) => {
  try {
    const tax = await LandTax.findById(req.params.taxId).populate("landId");
    if (!tax) return res.status(404).json({ message: "Tax record not found" });

    tax.paymentStatus = "Paid";
    tax.paidAt = new Date();

    const receiptUrl = await generateTaxReceipt(tax);
    tax.receiptUrl = receiptUrl;

    await tax.save();

    res.json({
      success: true,
      message: "Tax paid successfully",
      receiptUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tax history by land
export const getLandTaxHistory = async (req, res) => {
  const taxes = await LandTax.find({ landId: req.params.landId })
    .sort({ taxYear: -1 });

  res.json(taxes);
};
