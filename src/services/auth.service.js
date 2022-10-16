import passport from 'passport';
import LocalStrategy from 'passport-local';
import Teacher from '../models/teacher.model.js';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
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
        const teacher = await Teacher.findById(jwt_payload._id);

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

// Sean TODO:  Implement Google strategy once login screen is implemented
// passport.use(new GoogleStrategy({
//     clientID: config.GOOGLE_CLIENT_ID,
//     clientSecret: config.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);

//     Teacher.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
