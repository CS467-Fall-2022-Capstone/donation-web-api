import Donation from '../models/donation.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import Student from '../models/student.model.js';
import Supply from '../models/supply.model.js';
import Teacher from '../models/teacher.model.js';

/**
 * Controller functions to be mounted on the Donation route
 */
const bulkWriteDonations = async (req, res) => {
    const student_id = req.params.studentId;
    const donations = req.body;
    const donationsToRemove = donations.map(filterDonationPull); // array of donation objectIds
    const filteredDonationsToRemove = donationsToRemove.filter(
        (id) => id !== undefined
    );
    // Remove existing donations from arrays if there are any updated to 0
    if (donationsToRemove.length > 0) {
        // Remove the donations from student.donations[]
        await Student.findByIdAndUpdate(
            student_id,
            {
                $pull: { donations: { $in: filteredDonationsToRemove } },
            },
            { new: true }
        ).exec();
        // Find all the donations to remove from supplies
        const donationsWithSupplyId = await Donation.find({
            _id: { $in: filteredDonationsToRemove },
        }).exec();
        // Create updateOne operations for the Supplies in donation.supply_id
        const pullDonationOps = donationsWithSupplyId.map((item) => {
            if (item) {
                let updateOneOp = {
                    updateOne: {
                        filter: { _id: item.supply_id },
                        update: { $pull: { donations: item._id } },
                    },
                };
                return updateOneOp;
            }
        });
        // Remove the donations from supplies.donations[]
        const removalUpdates = await Supply.bulkWrite(pullDonationOps);
        console.log(
            `${removalUpdates.modifiedCount} / ${pullDonationOps.length} supplies with donation removed`
        );
        // Set all the removed donations supply_id and student_id to null so they don't
        // populate in supply.donations[] and student.donations[] queries
        const result = await Donation.updateMany(
            { _id: { $in: filteredDonationsToRemove } },
            { student_id: null, supply_id: null, quantityDonated: 0 }
        );
        console.log(`${result.modifiedCount} donations removed from metrics`);
    }
    // Create or Update donations
    const donationsToWrite = donations.map(filterDonationOps); // array of donations to create or update
    const filteredDonationsToWrite = donationsToWrite.filter(
        (item) => item !== undefined
    );
    const donationBulkOperations = filteredDonationsToWrite.map(
        createBulkWriteOperation
    ); // array of insertOne and updateOne operations
    const result = await Donation.bulkWrite(donationBulkOperations);
    if (result.insertedCount > 0) {
        const newDonations = result.getInsertedIds();
        const newDonationIds = newDonations.map((donation) => {
            if (donation) {
                return donation._id;
            }
        });
        await Student.findByIdAndUpdate(
            student_id,
            { $push: { donations: { $each: newDonationIds } } },
            { new: true }
        ).exec();
        // const bulkUpdateOps = addDonationToSupplies(newDonationIds);
        const donationsWithSupplyId = await Donation.find({
            _id: { $in: newDonationIds },
        }).exec();
        // Create updateOne operations for the Supplies in donation.supply_id
        const supplyUpdates = donationsWithSupplyId.map((item) => {
            if (item) {
                let updateOp = {
                    updateOne: {
                        filter: { _id: item.supply_id },
                        update: { $push: { donations: item._id } },
                    },
                };
                return updateOp;
            }
        });
        // Insert all new donations into the supplys.donation array
        const updateResults = await Supply.bulkWrite(supplyUpdates);
        console.log(
            `${updateResults.modifiedCount} / ${supplyUpdates.length} supplies updated`
        );
    }
    return res.status(200).send('bulkWrite successful');
};

const filterDonationPull = (item) => {
    if (item.update && item.donationFields.quantityDonated == 0) {
        // if its existing donation and the student set it to 0, then set for removal from supply
        return item.donationFields.donation_id;
    }
};

const filterDonationOps = (item) => {
    if (!item.update && item.donationFields.quantityDonated > 0) {
        return item;
    } else if (item.update && item.donationFields.quantityDonated > 0) {
        return item;
    }
};

const createBulkWriteOperation = (item) => {
    if (item.update === true) {
        // donation exists
        return {
            updateOne: {
                filter: { _id: item.donationFields.donation_id },
                update: {
                    quantityDonated: item.donationFields.quantityDonated,
                },
            },
        };
    } else {
        // item.update is false so its a new donation, create insertOne operation
        return {
            insertOne: {
                document: { ...item.donationFields },
            },
        };
    }
};

/**
 * Use to load the donation object into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
const donationByID = async (req, res, next, id) => {
    try {
        let donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({
                error: 'Donation not found',
            });
        }
        let supply_id = donation.supply_id;
        let supply = await Supply.findById(supply_id);
        let item = supply.item;
        donation.item = item;
        req.donation = donation;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve this donation',
        });
    }
};

const create = async (req, res) => {
    try {
        let student = await Student.findById(req.body.student_id);
        let student_id = student._id;
        let supply = await Supply.findById(req.body.supply_id);
        let supply_id = supply._id;

        const donationBody = {
            student_id,
            supply_id,
            quantityDonated: req.body.quantityDonated,
        };
        const donation = await Donation.create(donationBody);

        student.donations.push(donation._id);
        await student.save();
        supply.donations.push(donation._id);
        await supply.save();

        return res.status(201).json(donation.toJSON());
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const read = (req, res) => {
    return res.json(req.donation.toJSON());
};

export default { bulkWriteDonations, donationByID, create, read };
