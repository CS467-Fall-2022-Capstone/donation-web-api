import converter from 'json-2-csv';
import fs from 'fs';
import Teacher from '../models/teacher.model.js';

/**
 * Controller function to be mounted on the Csv route
*/

// teacher downloads csv from donors list
const downloadCsv = async (req,res) => {
    let teacher_id = req.query.t;
    console.log(teacher_id);
    // first get JSON of data
    let teacher = await Teacher.findById(teacher_id)
    .select('students')
    .populate({
        path: 'students', // get all student docs with donations with donated supply
        select: '-teacher_id',
        populate: {
            path: 'donations',
            select: '-student_id',
            populate: {
                // only get the supply name and quantity donated for student's supply
                path: 'supply_id',
                select: 'item quantityDonated',
            },
        },
    })
    .lean();

/*
    .select('-google_id -created -updated')
    .populate('supplies') // get all supply docs
    .populate({
        path: 'students', // get all student docs with donations with donated supply
        select: '-teacher_id',
        populate: {
            path: 'donations',
            select: '-student_id',
            populate: {
                // only get the supply name and quantity donated for student's supply
                path: 'supply_id',
                select: 'item quantityDonated',
            },
        },
    })


*/

    console.log(teacher.students);
    let donorsList = teacher.students.map(student => {
        let formattedStudent = {};
        formattedStudent.student_id = student._id.toString();
        formattedStudent.firstName = student.firstName;
        formattedStudent.lastName = student.lastName;
        formattedStudent.donations = [];
        student.donations.forEach(donation => {
            let item = donation.supply_id.item;
            let quantityDonated = donation.quantityDonated;
            let donationMade = `${item} - ${quantityDonated}`;
            formattedStudent.donations.push(donationMade);
        });
        return formattedStudent;
    })
    //then convert json to csv file
    converter.json2csv(donorsList, (err, csv) => {
        if (err) {
            throw err;
        }
 
        // write CSV to a file
        fs.writeFileSync('donorsList.csv', csv);
        console.log('after writing file');
        res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        res.set('Content-type', 'text/csv');
        res.status(200).send(csv);      
    });

};


export default { downloadCsv };