import Supply from '../models/supply.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import Teacher from '../models/teacher.model.js';

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

const create = async (req,res) => {
    try {
        const supply = await Supply.create(req.body);
        const teacher_id = req.user._id.toString();
        const teacher = await Teacher.findById(teacher_id);
        teacher.supplies.push(supply._id);
        teacher.save();
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
        let supply_id = supply._id;
        const teacher_id = req.user._id.toString();
        const teacher = await Teacher.findById(teacher_id);
        let index = teacher.supplies.indexOf(supply_id);
        if (index > -1) {
            teacher.supplies.splice(index, 1);
        }
        teacher.save();
        await supply.remove();
        return res.status(204).json({'msg': 'supply deleted'});
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

export default { supplyByID, create, remove, update, read };
