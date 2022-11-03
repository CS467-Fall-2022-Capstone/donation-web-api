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

DonationSchema.methods = {
    toJSON() {
        return {
            donation_id: this._id,
            supply_id: this.supply_id,
            student_id: this.student_id,
            quantityDonated: this.quantityDonated,
            item: this.item
        };
    },
};
export default mongoose.model('Donation', DonationSchema);
