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
   quantityDonated: {
        type: Number,
        required: [true,'quantityDonated is required']
    },
});

DonationSchema.methods = {
    toJSON() {
        return {
            donation_id: this._id,
            supply_id: this.supply_id,
            student_id: this.student_id,
            quantityDonated: this.quantityDonated,
        };
    },
};
export default mongoose.model('Donation', DonationSchema);
