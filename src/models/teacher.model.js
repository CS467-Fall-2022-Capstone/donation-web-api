'use strict'
import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Teacher schema defined using Mongoose
 */

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'A name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String,
    supplies: {
        type: [String],
        default: undefined
    },
    students: {
        type: [String],
        default: undefined
    }
});

//Virtuals are document properties that you can get and set but do not get persisted to db
TeacherSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

//Add validation to the 'hashed_password' path
TeacherSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

TeacherSchema.methods = {
    /**
    * Generates an encrypted hash from the plain-text password and unique
    * salt value using the crypto module from Node
    * @param {password} arg A plain text password
    */
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    /**
    * Generates a unique and random salt value using the current
    * timestamp at execution and Math.random()
    * @param {password} arg A plain text password
    */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}


export default mongoose.model('Teacher', TeacherSchema);