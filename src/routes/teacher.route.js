import express from 'express';
import teacherCtrl from '../controllers/teacher.controller.js';
import { authJwt } from '../services/auth.service.js';

const router = express.Router();

// Auth Route
router.route('/teachers').get(authJwt, teacherCtrl.list);

// Protected CRUD
router
    .route('/teachers/:teacherId')
    .get(authJwt, teacherCtrl.read)
    .patch(authJwt, teacherCtrl.update)
    .delete(authJwt, teacherCtrl.remove);

// Public for Donations Page
router.route('/teachers/:teacherId/public').get(teacherCtrl.readPublic);

/**
 * Preloads user into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
router.param('teacherId', teacherCtrl.teacherByID);

export default router;
