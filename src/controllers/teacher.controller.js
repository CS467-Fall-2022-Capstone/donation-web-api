import Teacher from '../models/teacher.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import Supply from '../models/supply.model.js';
import Student from '../models/student.model.js';
import Donation from '../models/donation.model.js';

/**
 * Controller functions to be mounted on the Teacher route
 */
const list = async (req, res) => {
    try {
        let teachers = await Teacher.find().select(
            'name email updated created message isPublished supplies students'
        );
        res.json(teachers);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

/**
 * Use to load the teacher object into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
const teacherByID = async (req, res, next, id) => {
    try {
        let teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({
                error: 'Teacher not found',
            });
        }
        req.profile = teacher;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve this teacher',
        });
    }
};

const read = async (req, res) => {
    const teacher = req.profile;
    try {
        // return entire lean version of Teacher document with subdoc arrays populated
        // .lean() converts the MongoDB doc into plain JS object
        const completeTeacherData = await Teacher.findById(teacher._id)
            .populate('supplies') // get all supply docs
            .populate({
                path: 'students',  // get all student docs with donations with donated supply
                populate: {
                    path: 'donations',
                    populate: {  // only get the supply name and quantity donated for student's supply
                        path: 'supply_id',
                        select: 'item quantityDonated',
                    },
                },
            })
            .lean();
        // get the total donations for each supply
        const donatedTotals = await Donation.aggregate([
            // Get all donations where the donation.supply_id is in teacher.supplies
            { $match: { supply_id: { $in: teacher.supplies } } },
            // Group by supply_id and sum up the donation.quantityDonated
            {
                $group: {
                    _id: '$supply_id',
                    totalQuantityDonated: { $sum: '$quantityDonated' },
                },
            },
        ]);
        // // Merge the supplies array with the donated totals array and gather metrics
        let sumDonationQty = 0;
        let suppliesWithTotals = donatedTotals.map((donation) => {
            let supply = completeTeacherData.supplies.find(
                (supply) => supply._id.toString() === donation._id.toString()
            );
            if (supply) {
                sumDonationQty += donation.totalQuantityDonated;
            }
            return {
                ...supply,
                totalQuantityDonated: donation.totalQuantityDonated,
            };
        });
        // Add stats for metric cards
        completeTeacherData.supplies = suppliesWithTotals;
        completeTeacherData.metrics = {
            sumAllDonations: sumDonationQty,
            supplyWithDonations: suppliesWithTotals.length,
        };
        // return completed Teacher data and total donations grouped by supplyId
        res.status(200).json(completeTeacherData);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const readPublic = async (req, res) => {
    const teacher = req.profile;
    const supplyIds = teacher.supplies;
    try {
        // Finds all supplies by id in the supplies array
        const supplies = await Supply.find({
            _id: { $in: supplyIds },
        });
        res.status(200).json({
            teacher: {
                teacher_id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                school: teacher.school,
                message: teacher.message,
                isPublished: teacher.isPublished,
            },
            supplies: supplies,
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const update = async (req, res, next) => {
    try {
        let teacher = req.profile;
        let teacherRecord = await Teacher.findById(teacher._id);
        //lodash extend - merges the changes from body with the record
        // from db
        teacherRecord = extend(teacher, req.body);
        teacherRecord.updated = Date.now();
        teacher = await teacherRecord.save();
        res.status(200).json(teacher.toAuthJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const remove = async (req, res, next) => {
    try {
        let teacher = req.profile;
        await teacher.remove();
        res.status(204).end();
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const getSupplies = async (req, res) => {
    const teacher = req.profile;
    const supplyIds = teacher.supplies;
    try {
        // Finds all supplies by id in the supplies array
        const supplies = await Supply.find({
            _id: { $in: supplyIds },
        });
        res.status(200).json({
            supplies,
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const getStudents = async (req, res) => {
    const teacher = req.profile;
    const studentIds = teacher.students;
    try {
        // Finds all sutudents by id in the students array
        const students = await Student.find({
            _id: { $in: studentIds },
        });
        // each student has a donations array - want to return
        // an array of the donation objects (not donation_ids)
        // so the supplyItem and quantityDonated
        // can be displayed in the teacher dashboard donors table
        for (let i = 0; i < students.length; i++) {
            // donations assigned an array of student's Donation objects
            let donations = students[i].donations;
            let detailedDonations = [];
            for (let j = 0; j < donations.length; j++) {
                let detailedDonation = await Donation.findById(
                    donations[j]
                ).populate('supply_id');
                console.log(detailedDonation);
                detailedDonations.push(detailedDonation);
            }
            students[i].donations = detailedDonations;
        }
        res.status(200).json({
            students,
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

export default {
    teacherByID,
    list,
    remove,
    update,
    read,
    readPublic,
    getSupplies,
    getStudents,
};
