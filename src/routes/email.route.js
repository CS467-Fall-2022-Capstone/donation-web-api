import express from 'express';
import emailCtrl from '../controllers/email.controller.js';

const router = express.Router();

router.route('/email').post(emailCtrl.send);

export default router;