import express from 'express';
import authCtrl from '../controllers/auth.controller.js';
import { authLocal, authGoogle } from '../services/auth.service.js';

const router = express.Router();

// Initial Sign Up/Registration Route
router.route('/signup').post(authCtrl.signUp);

// User Log In Route
router.route('/login').post(authLocal, authCtrl.login);

// Google Login Route
router.route('/google').post(authGoogle, authCtrl.login);

export default router;
