import express from 'express';
import donationCtrl from '../controllers/donation.controller.js';

const router = express.Router();

// bulk write and update student's donations
router.route('/donations/:studentId').post(donationCtrl.bulkWriteDonations);

// CRUD operations for testing
router.route('/donations').post(donationCtrl.create);

router
    .route('/donations/:donationId')
    .get(donationCtrl.read);

/**
 * Preloads user into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
router.param('donationId', donationCtrl.donationByID);

export default router;
