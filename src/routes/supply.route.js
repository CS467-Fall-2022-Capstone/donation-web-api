import express from 'express';
import supplyCtrl from '../controllers/supply.controller.js';
import { authJwt } from '../services/auth.service.js';

const router = express.Router();

router.route('/supplies').post(authJwt, supplyCtrl.create);

router
    .route('/supplies/:supplyId')
    .get(supplyCtrl.read)
    .patch(authJwt, supplyCtrl.update)
    .delete(authJwt, supplyCtrl.remove);

/**
 * Preloads user into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
router.param('supplyId', supplyCtrl.supplyByID);

export default router;
