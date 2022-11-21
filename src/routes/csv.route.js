import express from 'express';
import csvCtrl from '../controllers/csv.controller.js';

const router = express.Router();

router.route('/downloadCsv').get(csvCtrl.downloadCsv);

export default router;