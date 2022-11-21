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
    .select('-google_id -created -updated')
    .populate({
        path: 'students', // get all student docs with donations with donated supply
        //select: '-teacher_id -email -__v -donations'
        select: '_id firstName lastName donations'
    })
    .lean();
    console.log(teacher.students);
    // [{id:1, first_name: 'Annie', last_name: 'Zhu'}, {id:2, first_name: 'Chris', last_name: 'Shu'}];
    // then convert json to csv file
    converter.json2csv(teacher.students, (err, csv) => {
        if (err) {
            throw err;
        }
        // print CSV string
        console.log(csv);
  
        // write CSV to a file
        fs.writeFileSync('todos.csv', csv);
        console.log('after writing file');
        res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        res.set('Content-type', 'text/csv');
        res.status(200).send(csv);      
    });

};


export default { downloadCsv };