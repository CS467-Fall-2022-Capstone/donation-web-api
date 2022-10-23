import Teacher from '../models/teacher.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';

/**
 * Controller functions to be mounted on the Auth route
 */
/**
 *
 * Register teacher -- Used in the initial sign up route
 */
 const signUp = async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);
        // Return to client with teacher data and JWT token
        return res.status(201).json(teacher.toAuthJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const login = async (req, res, next) => {
    // Return to client with teacher data and JWT token
    res.status(200).json(req.user.toAuthJSON());
    return next();
};

export default { signUp, login };