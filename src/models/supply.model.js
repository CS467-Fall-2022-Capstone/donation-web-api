'use strict';
import mongoose, { Schema } from 'mongoose';

/**
 * Supply schema defined using Mongoose
 */

const SupplySchema = new Schema({
    item: {
        type: String,
        trim: true,
        required: [true, 'An item is required'],
    },
    totalQuantityNeeded: {
        type: Number,
        required: [true, 'totalQuantityNeeded is required'],
    },
    donations: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
});

SupplySchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            item: this.item,
            totalQuantityNeeded: this.totalQuantityNeeded,
            donations: this.donations,
        };
    },
};

export default mongoose.model('Supply', SupplySchema);
