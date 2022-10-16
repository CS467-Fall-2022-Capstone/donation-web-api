import express from 'express';
import authCtrl from '../controllers/auth.controller.js';
import { authLocal } from '../services/auth.service.js';

const router = express.Router();

// Initial Sign Up/Registration Route
router.route('/signup').post(authCtrl.signUp);

// User Log In Route
router.route('/login').post(authLocal, authCtrl.login);

// Google Login Route
// Sean TODO: Finalize implementation when Login Screen is done
// router.route(
//     '/google',
//     passport.authenticate('google', { scope: ['profile'] })
// );

export default router;
