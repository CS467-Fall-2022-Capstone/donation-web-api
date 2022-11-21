'use strict';
import mongoose, { Schema } from 'mongoose';
/**
 * Student schema defined using Mongoose
 */

const StudentSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'firstName is required'],
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
    },
    teacher_id: {
        type: String,
        required: [true, 'teacher_id is required'],
    },
    donations: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
    donation_code: {
        type: String,
    },
});

StudentSchema.pre('save', function (next) {
    const id = this._id.toString();
    this.donation_code = `${this.lastName}-${id.substring(id.length - 4)}`;
    next();
});

StudentSchema.methods = {
    toJSON() {
        return {
            student_id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            teacher_id: this.teacher_id,
            donations: this.donations,
            donation_code: this.donation_code,
        };
    },
};

export default mongoose.model('Student', StudentSchema);
