'use strict';
import mongoose, { Schema } from 'mongoose';

/**
 * Donation schema defined using Mongoose
 */

const DonationSchema = new Schema({
    student_id: {
        type: String,
        trim: true,
        required: [true, 'student_id is required']
    },
    supply_id: {
        type: String,
        required: [true, 'supply_id is required']
    },
    item: {
        type: String,
        required: [true, 'item is required']   
    },
   quantityDonated: {
        type: Number,
        required: [true,'quantityDonated is required']
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
});

export default mongoose.model('Donation', DonationSchema);
