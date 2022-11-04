'use strict';
import mongoose, { Schema } from 'mongoose';
import Donation from '../models/donation.model.js';
/**
 * Student schema defined using Mongoose
 */

const StudentSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'firstName is required']
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']   
    },
   teacher_id: {
        type: String,
        required: [true,'teacher_id is required']
    },
    donations: [
        {type: Schema.Types.ObjectId, ref: 'Donation' }
    ],
});

StudentSchema.methods = {
    toJSON() {
        return {
            student_id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            teacher_id: this.teacher_id,
            donations: this.donations
        };
    },
};

export default mongoose.model('Student', StudentSchema);
