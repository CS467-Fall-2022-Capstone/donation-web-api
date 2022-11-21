import Donation from '../models/donation.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import Student from '../models/student.model.js';
import Supply from '../models/supply.model.js';

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

/**
 * Use to load the donation object into the Express req object BEFORE
 * propogating to the next function thats specific to the request
 * that came in
 */
 const donationByID = async (req, res, next, id) => {
    console.log(req.id);
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

const create = async (req,res) => {
    console.log('inside create');
    try {
        console.log(req.body);
        let student = await Student.findById(req.body.student_id);
        let student_id = student._id;
        let supply = await Supply.findById(req.body.supply_id);
        let supply_id = supply._id;

        const donationBody = {
            student_id,
            supply_id,
            quantityDonated: req.body.quantityDonated
        };
        console.log(donationBody);
        const donation = await Donation.create(donationBody);
        console.log(donation);

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
    console.log(req.donation);
    return res.json(req.donation.toJSON());
};

export default { bulkWriteDonations, donationByID, create, read };
