import Student from '../models/student.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import Teacher from '../models/teacher.model.js';
import Supply from '../models/supply.model.js';
import Donation from '../models/donation.model.js';

/**
 * Controller functions to be mounted on the Student route
 */

/**
 * Use to load the student object into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
 const studentByID = async (req, res, next, id) => {
    try {
        let student = await Student.findById(id);
        if (!student)
            return res.status(404).json({
                error: 'Student not found',
            });
        req.student = student;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve this student',
        });
    }
};

const create = async (req,res) => {
    try {
        const student = await Student.create(req.body);
        const teacher_id = student.teacher_id;
        const teacher = await Teacher.findById(teacher_id);
        teacher.students.push(student._id);
        teacher.save();
        return res.status(201).json(student.toJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const read = (req, res) => {
    return res.json(req.student.toJSON());
};

const update = async (req, res, next) => {
    try {
        let student = req.student;
        //lodash extend - merges the changes from body with the record
        // from db
        student = extend(student, req.body);
        await student.save();
        res.status(200).json(student.toJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const remove = async (req, res, next) => {
    try {
        const student = req.student;
        const student_id = student._id;
        // remove student from teacher's students array
        const teacher_id = student.teacher_id;
        const teacher = await Teacher.findById(teacher_id);
        let student_index = teacher.students.indexOf(student_id);
        if (student_index > -1) {
            teacher.students.splice(student_index, 1);
        }
        await teacher.save();
        // remove student's donations from each Supply that contains 
        // the student's donation
        let donations = student.donations;
        donations.forEach(async(donation_id) => {
            const donation = await Donation.findById(donation_id);
            let supply_id = donation.supply_id;
            const supply = await Supply.findById(supply_id);
            let donation_index = supply.donations.indexOf(donation_id);
            if (donation_index > -1) {
                supply.donations.splice(donation_index, 1);
            }
            await supply.save();
            await donation.remove();
        });
        await student.remove();
        return res.status(204).json({'msg': 'student deleted'});
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const readStudentDonations = async (req, res) => {
    const student = req.student;
    const donations = student.donations;
    // when array is sent back, item, quantityDonated is also included for front-end use
    let expandedDonations = await Promise.all(donations.map( async (donation_id) => {
        let donationObject = await Donation.findById(donation_id);
        return {
            donation_id: donationObject._id,
            item: donationObject.item,
            quantityDonated: donationObject.quantityDonated
        }
    }));
    expandedDonations = {"donations": expandedDonations};
    return res.json(expandedDonations);
};

const updateStudentDonations = async (req, res) => {
    const student = req.student;
    const currDonations = student.donations; // array of Donation items {donation_id, student_id, supply_id, quantityDonated}
    const updatedDonations = req.body.updatedDonations; // array of objects {supply_id, quantityDonated}
    let newDonationSupplies = [];
    for( let i=0; i<updatedDonations.length; i++) {
        let supplyBeingUpdated = updatedDonations[i];
        let supplyBeingUpdatedId = supplyBeingUpdated.supply_id;
        let donationUpdated = false;
        for (let j=0; j<currDonations.length; j++) {
            
            let donation_id = currDonations[j];
            let donation = await Donation.findById(donation_id);
            if(supplyBeingUpdatedId == donation.supply_id) {
                donationUpdated = true;
                donation.quantityDonated = supplyBeingUpdated.quantityDonated;
                await donation.save();
            }
        }
        // supply not found in student's donations array so create new Donation
        if(!donationUpdated) {
            newDonationSupplies.push(supplyBeingUpdated);
        }
    }
    for(let i=0; i<newDonationSupplies.length; i++) {
        const newSupplyId = newDonationSupplies[i].supply_id;
        const newQuantityDonated = newDonationSupplies[i].quantityDonated;
        const donationData = {
            student_id: student._id,
            supply_id: newSupplyId,
            quantityDonated: newQuantityDonated
        }
        const donation = await Donation.create(donationData);
        student.donations.push(donation._id);
        await student.save();
        const supply_id = donation.supply_id;
        const supply = await Supply.findById(supply_id);
        supply.donations.push(donation._id);
        await supply.save()
    }
    let expandedDonations = await Promise.all(student.donations.map( async (donation_id) => {
        let donationObject = await Donation.findById(donation_id);
        return {
            donation_id: donationObject._id,
            item: donationObject.item,
            quantityDonated: donationObject.quantityDonated
        }
    }));
    expandedDonations = {"donations": expandedDonations};
    return res.json(expandedDonations);
};

const createDonation = async donationData => {

};

export default { studentByID, create, remove, update, read, readStudentDonations, updateStudentDonations };
