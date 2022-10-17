import express from 'express';
import teacherCtrl from '../controllers/teacher.controller.js';
import { authJwt } from '../services/auth.service.js';

const router = express.Router();

router.route('/api/teachers').get(authJwt, teacherCtrl.list);

router
    .route('/api/teachers/:teacherId')
    .get(authJwt, teacherCtrl.read)
    .put(authJwt, teacherCtrl.update)
    .delete(authJwt, teacherCtrl.remove);

/**
 * Preloads user into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
router.param('teacherId', teacherCtrl.teacherByID);

export default router;
