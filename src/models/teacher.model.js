'use strict';
import config from '../config/config.js';
import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Teacher schema defined using Mongoose
 */

const TeacherSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A name is required'],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator(email) {
                return validator.isEmail(email);
            },
            message: '{VALUE} is not a valid email!',
        },
        required: [true, 'Email is required'],
    },
    google_id: {
        type: String,
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, 'Password need to be longer!'],
    },
    school: {
        type: String,
        default: 'Add your school',
    },
    message: {
        type: String,
        default: 'Add your message',
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    supplies: [{ type: Schema.Types.ObjectId, ref: 'Supply' }],
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
});

// Pre-save to check for unique teacher users
TeacherSchema.plugin(uniqueValidator, {
    message: '{VALUE} is already taken!',
});

TeacherSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = this._hashPassword(this.password);
    }
    return next();
});

TeacherSchema.methods = {
    // Hash password
    _hashPassword(password) {
        return hashSync(password, 10);
    },
    // Authenticate user by comparing hashed passwords
    authenticateUser(password) {
        return compareSync(password, this.password);
    },
    // Create JWT token
    createToken() {
        return jwt.sign(
            {
                _id: this._id,
            },
            config.JWT_SECRET,
            { expiresIn: '2h' } // expires in 2 hours from issued time (iat)
        );
    },
    // Send User Data as Json including token
    toAuthJSON() {
        return {
            teacher_id: this._id,
            email: this.email,
            name: this.name,
            school: this.school,
            message: this.message,
            isPublished: this.isPublished,
            token: `${this.createToken()}`,
        };
    },
    // Send User Data as Json without token
    toJSON() {
        return {
            teacher_id: this._id,
            email: this.email,
            name: this.name,
            school: this.school,
            message: this.message,
            isPublished: this.isPublished,
            supplies: this.supplies,
            students: this.students,
        };
    },
};

export default mongoose.model('Teacher', TeacherSchema);
