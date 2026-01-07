// routes/ownershipTransferRoutes.js
import express from "express";
import {
  applyTransfer,
  approveTransfer,
  getTransferHistory
} from "../controllers/ownershipTransferController.js";

import { isAuthenticated, isOfficer } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/apply",
  isAuthenticated,
  upload.fields([
    { name: "citizenship", maxCount: 1 },
    { name: "saleDeed", maxCount: 1 },
    { name: "taxClearance", maxCount: 1 }
  ]),
  applyTransfer
);

router.put(
  "/approve/:id",
  isAuthenticated,
  isOfficer,
  approveTransfer
);

router.get(
  "/history/:landId",
  isAuthenticated,
  getTransferHistory
);

export default router;
