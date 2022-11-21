import express from 'express';
import emailCtrl from '../controllers/email.controller.js';

const router = express.Router();

router.route('/emailDonationId').post(emailCtrl.emailDonationId);

export default router;
