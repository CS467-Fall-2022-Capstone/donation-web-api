import express from 'express';
import emailCtrl from '../controllers/email.controller.js';

const router = express.Router();

router.route('/emailDonationId').post(emailCtrl.emailDonationId);
router.route('/emailAfterSubmitDonation').post(emailCtrl.emailAfterSubmitDonation);

export default router;
