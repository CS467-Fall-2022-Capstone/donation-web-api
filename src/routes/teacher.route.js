import express from 'express';
import teacherCtrl from '../controllers/teacher.controller.js';
//import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/teachers')
    .get(teacherCtrl.list)
    .post(teacherCtrl.create);  //initial signup route

//NO PROTECTED ROUTES
router.route('/api/teachers/:teacherId')
    .get(teacherCtrl.read)
    .put(teacherCtrl.update)
    .delete(teacherCtrl.remove);

/*
//this are routes with a basic system of password storage loaded on the route
//these functions (requireSignin, hasAuthorization) could be remade with the password.js
// in the auth controller using the selected strategy

router.route('/api/teachers/:teacherId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);
*/

/**
 * Preloads user into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
router.param('teacherId', teacherCtrl.teacherByID);

export default router;