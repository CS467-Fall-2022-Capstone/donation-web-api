'use strict';
import mongoose, { Schema } from 'mongoose';

/**
 * Donation schema defined using Mongoose
 */

const DonationSchema = new Schema({
});

export default mongoose.model('Donation', DonationSchema);
