'use strict';
import mongoose, { Schema } from 'mongoose';

/**
 * Supply schema defined using Mongoose
 */

const SupplySchema = new Schema({
    item: {
        type: String,
        trim: true,
        required: [true, 'An item is required']
    },
    totalQuantityNeeded: {
        type: Number,
        required: [true, 'totalQuantityNeeded is required']
    },
    quantityDonated: {
        type: Number,
        required: [true, 'quantityDonated is required']
    },
    donations: {
        type: Array,
        required: [true, 'donations is required']
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
});

SupplySchema.methods = {
    // Send User Data as Json without token
    toJSON() {
        return {
            _id: this._id,
            item: this.item,
            totalQuantityNeeded: this.totalQuantityNeeded,
            quantityDonated: this.quantityDonated,
            donations: this.donations
        };
    },
};

export default mongoose.model('Supply', SupplySchema);
