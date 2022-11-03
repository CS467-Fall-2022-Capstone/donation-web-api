import Donation from '../models/donation.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import Student from '../models/student.model.js';
import Supply from '../models/supply.model.js';

/**
 * Controller functions to be mounted on the Donation route
 */

/**
 * Use to load the donation object into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
 const donationByID = async (req, res, next, id) => {
    try {
        let donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({
                error: 'Donation not found',
            });
        }
        let supply_id = donation.supply_id;
        let supply = await Supply.findById(supply_id);
        let item = supply.item;
        donation.item = item;
        req.donation = donation;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve this donation',
        });
    }
};

const create = async (req,res) => {
    try {
        const donation = await Donation.create(req.body);
        const student_id = donation.student_id;
        const student = await Student.findById(student_id);
        student.donations.push(donation._id);
        student.save();
        const supply_id = donation.supply_id;
        const supply = await Supply.findById(supply_id);
        supply.donations.push(donation._id);
        supply.save();
        return res.status(201).json(donation.toJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const read = (req, res) => {
    return res.json(req.donation.toJSON());
};

export default { donationByID, create, read };
