import express from 'express'
import { checkPaymentStatus, donate, getAllDonations, getChurchDonations } from '../controllers/donation.controller.js';
import { isAdminOrManager } from '../middlewares/isAdmin.js';

const router = express.Router();


router.post("/", donate)
router.get("/", getAllDonations)
router.get("/status", checkPaymentStatus);
router.get("/church", isAdminOrManager, getChurchDonations);
export default router