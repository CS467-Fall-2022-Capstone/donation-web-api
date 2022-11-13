import passport from 'passport';
import LocalStrategy from 'passport-local';
import Teacher from '../models/teacher.model.js';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import passportCustom from 'passport-custom';
import config from '../config/config.js';
const CustomStrategy = passportCustom.Strategy;

// Jwt strategy
const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
    algorithms: [config.JWT_ALGO],
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
        //Identify user by ID
        const teacher = await Teacher.findById(jwt_payload._id).exec();

        if (!teacher) {
            return done(null, false);
        }
        return done(null, teacher);
    } catch (e) {
        return done(e, false);
    }
});

// email will be local strategies username
const localOpts = {
    usernameField: 'email',
};

const localStrategy = new LocalStrategy(
    localOpts,
    async (email, password, done) => {
        try {
            const teacher = await Teacher.findOne({
                email,
            });
            if (!teacher) {
                // Teacher not found
                return done(null, false);
            } else if (!teacher.authenticateUser(password)) {
                // Invalid credentials
                return done(null, false);
            }
            // Teacher found
            return done(null, teacher);
        } catch (e) {
            return done(e, false);
        }
    }
);

const googleStrategy = new CustomStrategy(async function (req, done) {
    try {
        // Find by email in case user signed up with email/password before signing up with Google
        let teacher = await Teacher.findOne({
            email: req.body.email,
        });
        if (teacher) {
            return done(null, teacher);
        } else {
            // create Teacher
            const newTeacher = new Teacher({
                name: req.body.name,
                email: req.body.email,
                google_id: req.body.sub,
            });

            await newTeacher.save();
            return done(null, newTeacher);
        }
    } catch (error) {
        return done(error, false);
    }
});

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
export const authGoogle = passport.authenticate('custom', {
    session: false,
});
