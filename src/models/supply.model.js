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
    isArchived: {
        type: Boolean,
        default: false,
    },
});

SupplySchema.methods = {
    toJSON() {
        return {
            supply_id: this._id,
            item: this.item,
            totalQuantityNeeded: this.totalQuantityNeeded,
            donations: this.donations,
            isArchived: this.isArchived,
        };
    },
};

export default mongoose.model('Supply', SupplySchema);
