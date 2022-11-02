import express from 'express';
import studentCtrl from '../controllers/student.controller.js';

const router = express.Router();

router.route('/students').post(studentCtrl.create);

router
    .route('/students/:studentId')
    .get(studentCtrl.read)
    .patch(studentCtrl.update)
    .delete(studentCtrl.remove);

/**
 * Preloads user into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
router.param('studentId', studentCtrl.studentByID);

export default router;