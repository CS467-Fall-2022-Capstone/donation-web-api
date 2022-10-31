import express from 'express';
import supplyCtrl from '../controllers/supply.controller.js';

const router = express.Router();

router.route('/api/supplies').post(supplyCtrl.create);

router
    .route('/api/supplies/:supplyId')
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
