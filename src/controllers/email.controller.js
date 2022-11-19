/**
 * Controller functions to be mounted on the Email route
 */

 const send = async (req, res) => {
    try {
        /*
        const student = await Student.create(req.body);
        const teacher_id = student.teacher_id;
        const teacher = await Teacher.findById(teacher_id);
        teacher.students.push(student._id);
        teacher.save();
        return res.status(201).json(student.toJSON());
        */
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};