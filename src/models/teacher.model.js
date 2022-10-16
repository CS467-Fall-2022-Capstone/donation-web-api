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
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [6, 'Password need to be longer!'],
    },
    // TODO: uncomment once supplySchema and studentSchema are defined
    // supplies: [supplySchema],
    // students: [studentSchema],
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
            config.JWT_SECRET
        );
    },
    // Send User Data as Json including token
    toAuthJSON() {
        return {
            _id: this._id,
            email: this.email,
            name: this.name,
            token: `JWT ${this.createToken()}`,
        };
    },
};

export default mongoose.model('Teacher', TeacherSchema);
