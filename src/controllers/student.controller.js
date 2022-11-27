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

const create = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        const teacher_id = student.teacher_id;
        const teacher = await Teacher.findById(teacher_id);
        teacher.students.push(student._id);
        teacher.save();
        return res.status(201).json(student);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const read = async (req, res) => {
    // This will return the Student with the donations array populated and populate
    // each donations assoaciated supply item
    try {
        const completeStudentData = await Student.findById(req.student._id)
            .select('-teacher_id')
            .populate({
                path: 'donations',
                select: 'quantityDonated',
                populate: { path: 'supply_id', select: 'item' },
            })
            .lean();
        return res.status(200).json(completeStudentData);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const update = async (req, res, next) => {
    try {
        let student = req.student;
        //lodash extend - merges the changes from body with the record
        // from db
        student = extend(student, req.body);
        await student.save();
        res.status(200).json(student);
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
        teacher.students.pull(student_id);
        await teacher.save();
        await Donation.deleteMany({ student_id: student_id });
        await student.remove();
        return res.status(204).end();
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const studentByDonationCode = async (req, res) => {
    // find Student by donation code
    console.log(req.params.donationCode);
    const donationCode = req.params.donationCode;
    const student = await Student.findOne({
        donation_code: donationCode,
    }).exec();
    if (student) {
        console.log(student);
        return res.status(200).json({ student_id: student._id });
    } else {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

export default {
    studentByID,
    studentByDonationCode,
    create,
    remove,
    update,
    read,
};
