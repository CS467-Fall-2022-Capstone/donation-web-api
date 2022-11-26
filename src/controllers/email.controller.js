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
    let message = `Your Donation ID is ${student.donation_code}. Thank you for your donation.\n${teacher_name}`;
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.TSD_EMAIL_ADDRESS,
            pass: process.env.TSD_EMAIL_PASS
        }
    }));
    let mailOptions = {
        from: process.env.TSD_EMAIL_ADDRESS,
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

const emailAfterSubmitDonation = async (req,res) => {

    let student_email = req.body.email;
    let teacher_name = req.body.teacherName;
    let student_name = req.body.studentName;
    let donation_code = req.body.donationCode;
    let studentDonations = "";
    let count = 0;
    req.body.studentDonations.forEach(donation => {
        count++;
        studentDonations += donation;
        if( count < req.body.studentDonations.length ) {
            studentDonations += ", ";
        }
    });

    let message = 
    `Hello ${student_name},
    
    Thank you so much for your donation of the following:
    ${studentDonations}
    If you would like to update your donation, your Donation Code is ${donation_code}.
    Best,
    ${teacher_name}`;
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.TSD_EMAIL_ADDRESS,
            pass: process.env.TSD_EMAIL_PASS
        }
    }));
    let mailOptions = {
        from: process.env.TSD_EMAIL_ADDRESS,
        to: student_email,
        subject: 'Donation Confirmation',
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


export default { emailDonationId, emailAfterSubmitDonation };
