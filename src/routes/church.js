import express from "express";
import {
  addChurch,
  deleteChurch,
  getAllChurches,
  getChurchById,
  getChurchesByManager,
  updateChurch,
} from "../controllers/church.controller.js";
import { isAdmin, isAdminOrManager } from "../middlewares/isAdmin.js";
const router = express.Router();

router.post("/", isAdmin, addChurch);
router.get("/", isAdmin, getAllChurches);
router.get("/manager-get-church", getChurchesByManager);
router.get("/:churchId", getChurchById);
router.put("/:churchId", isAdminOrManager, updateChurch);
router.delete("/:churchId", deleteChurch);
export default router;
