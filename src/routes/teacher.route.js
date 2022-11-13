import express from 'express';
import teacherCtrl from '../controllers/teacher.controller.js';
import { authJwt } from '../services/auth.service.js';

const router = express.Router();

router.route('/teachers').get(authJwt, teacherCtrl.list);

router.route('/teachers/:teacherId/public').get(teacherCtrl.readPublic);

router
    .route('/teachers/:teacherId')
    .get(authJwt, teacherCtrl.read)
    .put(authJwt, teacherCtrl.update)
    .delete(authJwt, teacherCtrl.remove);

router.route('/teachers/:teacherId/supplies').get(teacherCtrl.getSupplies)

router.route('/teachers/:teacherId/students').get(teacherCtrl.getStudents)

/**
 * Preloads user into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
router.param('teacherId', teacherCtrl.teacherByID);

export default router;
