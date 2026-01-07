// controllers/ownershipTransferController.js
import OwnershipTransfer from "../models/OwnershipTransfer.js";
import Land from "../models/Land.js";

// Apply for ownership transfer
export const applyTransfer = async (req, res) => {
  try {
    const { landId, previousOwner, newOwner } = req.body;

    const transfer = await OwnershipTransfer.create({
      landId,
      previousOwner,
      newOwner,
      documents: req.files
    });

    res.status(201).json({
      success: true,
      message: "Ownership transfer request submitted",
      transfer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve transfer
export const approveTransfer = async (req, res) => {
  try {
    const transfer = await OwnershipTransfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ message: "Not found" });

    transfer.status = "Approved";
    transfer.verifiedBy = req.user.id;
    transfer.verifiedAt = new Date();
    await transfer.save();

    // Update land owner
    const land = await Land.findById(transfer.landId);
    land.owner = transfer.newOwner;
    land.transferHistory.push(transfer._id);
    await land.save();

    res.json({
      success: true,
      message: "Ownership transferred successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transfer history
export const getTransferHistory = async (req, res) => {
  const history = await OwnershipTransfer.find({
    landId: req.params.landId
  }).sort({ createdAt: -1 });

  res.json(history);
};
