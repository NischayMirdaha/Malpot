import express from "express";
import { registerLand } from "../Controller/Land/landController.js";
import upload from "../middleware/upload.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  isAuthenticated,
  upload.single("ownershipDocument"),
  registerLand
);

export default router;
