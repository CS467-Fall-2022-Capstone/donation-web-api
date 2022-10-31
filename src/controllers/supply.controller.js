import Supply from '../models/supply.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';


/**
 * Controller functions to be mounted on the Supply route
 */


/**
 * Use to load the supply object into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
const supplyByID = async (req, res, next, id) => {
    try {
        let supply = await Supply.findById(id);
        if (!supply)
            return res.status(404).json({
                error: 'Supply not found',
            });
        req.supply = supply;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve this supply',
        });
    }
};

const create = (req,res) => {
    try {
        req.body.donations = [];
        req.body.quantityDonated = 0;
        // how do you get teacher_id from Jwt token?
        const supply = await Supply.create(req.body);
        // add supply to Teacher with teacher_id
        // get teacher_id from req
        
        // get teacher from teacher_id

        // add supply to suppplies array

        // Return to client with Supply data
        return res.status(201).json(supply.toJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const read = (req, res) => {
     return res.json(req.supply.toJSON());
};

const update = async (req, res, next) => {
    try {
        let supply = req.supply;
        //lodash extend - merges the changes from body with the record
        // from db
        supply = extend(supply, req.body);
        supply.updated = Date.now();
        await supply.save();
        res.status(200).json(supply.toJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const remove = async (req, res, next) => {
    try {
        let supply = req.supply;
        await supply.remove();
        res.status(204);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

export default { supplyByID, create, remove, update, read };
