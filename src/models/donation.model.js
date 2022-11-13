'use strict';
import mongoose, { Schema } from 'mongoose';
import Supply from './supply.model.js';
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
        type: Schema.Types.ObjectId, 
        ref: 'Supply',
        required: [true, 'supply_id is required']
    },
    supplyItem: {
        type: String
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
            supplyItem: this.getSupplyItem()
        };
    },
    async getSupplyItem() {
        const supply = await Supply.findById(this.supply_id);
        return supply.item;
    }
};
export default mongoose.model('Donation', DonationSchema);
