import express from 'express';
import donationCtrl from '../controllers/donation.controller.js';

const router = express.Router();

// bulk write and update student's donations
router.route('/donations/:studentId').post(donationCtrl.bulkWriteDonations);

export default router;
