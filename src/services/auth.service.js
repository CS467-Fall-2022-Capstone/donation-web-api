import passport from 'passport';
import LocalStrategy from 'passport-local';
import Teacher from '../models/teacher.model.js';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config/config.js';

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

const googleStrategy = new GoogleStrategy(
    {
        clientID: config.GOOGLE_CLIENTID,
        clientSecret: config.GOOGLE_SECRET,
        callbackURL: config.GOOGLE_CALLBACK,
        passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            let teacher = await Teacher.findOne({ google_id: profile.id });
            if (teacher) {
                return done(null, teacher);
            } else {
                // create Teacher
                const newTeacher = new Teacher({
                    google_id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });

                await newTeacher.save();
                return done(null, newTeacher);
            }
        } catch (error) {
            return done(error, false);
        }
    }
);

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
export const authGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
});
