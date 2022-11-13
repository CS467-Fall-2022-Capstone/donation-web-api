import Teacher from '../models/teacher.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import Supply from '../models/supply.model.js';
import Student from '../models/student.model.js';
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
        if (!teacher)
            return res.status(404).json({
                error: 'Teacher not found',
            });
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
    const supplyIds = teacher.supplies;
    const studentIds = teacher.students;
    try {
        // Finds all supplies by id in the supplies array
        const supplies = await Supply.find({
            _id: { $in: supplyIds }
        });
        // Finds all students by id in the students array
        const students = await Student.find({
            _id: { $in: studentIds }
        });
        res.status(200).json({
            teacher: {
                teacher_id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                school: teacher.school,
                message: teacher.message,
                isPublished: teacher.isPublished            
            },
            supplies,
            students
        });
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
                isPublished: teacher.isPublished               
            },
            supplies: supplies
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
        //lodash extend - merges the changes from body with the record
        // from db
        teacher = extend(teacher, req.body);
        teacher.updated = Date.now();
        await teacher.save();
        res.status(200).json(teacher.toJSON());
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
            supplies
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
        res.status(200).json({
            students
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
    getStudents
};
