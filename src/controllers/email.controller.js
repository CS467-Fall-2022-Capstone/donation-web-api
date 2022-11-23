import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import Student from '../models/student.model.js';
/**
 * Controller function to be mounted on the Email route
*/


const emailDonationId = async (req,res) => {
    let student_email = req.body.email;
    let teacher_name = req.body.teacher_name;
    let student = await Student.findOne({email: student_email});
    let message = `Your Donation Code is ${student.donation_code}. Thank you for your donation.\n${teacher_name}`;
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'tsdcapstone@gmail.com',
            pass: process.env.TSD_EMAIL_PASS
        }
    }));
    let mailOptions = {
        from: 'tsdcapstone@gmail.com',
        to: student_email,
        subject: 'Requested Donation ID',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.sendStatus(200);
        }
    })
};

export default { emailDonationId };
