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
    const donationBulkOperations = donations.map(createBulkWriteOperation);
    const filteredBulkOperations = donationBulkOperations.filter(
        (item) => item !== undefined
    );
    const results = await Donation.bulkWrite(filteredBulkOperations);
    // returns an array of ids that were inserted after the bulkWrite
    const newDonations = results.getInsertedIds();
    if (newDonations.length > 0) {
        // push the new donation ids to Student.donations and Supply.donations
        const student = await Student.findByIdAndUpdate(
            student_id,
            { $push: { donations: { $each: newDonations } } },
            { new: true }
        );
        const bulkUpdateOps = await addDonationToSupplies(newDonations);
        // Insert all new donations into the supplys.donation array
        const supplyUpdates = await Supply.bulkWrite(bulkUpdateOps);
        console.log(
            `${supplyUpdates.modifiedCount} / ${bulkUpdateOps.length} supplies updated`
        );
    }
    return res.status(200).send('Success');
};

const addDonationToSupplies = async (donations) => {
    // Find all the new donations
    const donationsWithSupplyId = await Donation.find({
        _id: { $in: donations },
    });
    // Create updateOne operations for the Supplies in donation.supply_id
    const supplyUpdates = donationsWithSupplyId.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.supply_id },
                update: { $push: { donations: item._id } },
            },
        };
    });
    return supplyUpdates;
};

const createBulkWriteOperation = (item) => {
    if (item.update) {
        // donation exists
        if (item.donationFields.quantityDonated === 0) {
            // if its existing donation and the student set it to 0, then remove the donation
            return {
                deleteOne: { filter: item.donationFields.donation_id },
            };
        } else {
            // quantityDonated > 0 so update
            return {
                updateOne: {
                    filter: { _id: item.donationFields.donation_id },
                    update: {
                        quantityDonated: item.donationFields.quantityDonated,
                    },
                },
            };
        }
    } else {
        // item.update is false so its a new donation, create insertOne operation
        // only create a new donation for items where the student inputted a non-zero value
        if (item.donationFields.quantityDonated > 0) {
            return {
                insertOne: {
                    document: { ...item.donationFields },
                },
            };
        }
    }
};

export default { bulkWriteDonations };
