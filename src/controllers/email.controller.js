import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import Student from '../models/student.model.js';
import ejs from 'ejs';

// Renders HTML with EJS
const sendHTMLEmail = (
    recipient,
    subject,
    htmlContent,
    plainTextMessage,
    template
) => {
    // Create transporter
    let transporter = nodemailer.createTransport(
        smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'tsdcapstone@gmail.com',
                pass: process.env.TSD_EMAIL_PASS,
            },
        })
    );

    // Render and send email
    ejs.renderFile(
        path.join(__dirname, `${template}Template.ejs`),
        { recipient, htmlContent },
        (err, data) => {
            // data is the html
            if (err) {
                console.log(err);
            } else {
                let mailOptions = {
                    from: 'tsdcapstone@gmail.com',
                    to: recipient,
                    subject: subject,
                    text: plainTextMessage, // text version will render if recipient restricts html
                    html: data,
                    attachments: [
                        {
                            filename: 'TSDlogo-transparent.png',
                            path: __dirname + 'TSDlogo-transparent.png',
                            cid: 'logo',
                        },
                    ],
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.sendStatus(200);
                    }
                });
            }
        }
    );
};

/**
 * Controller function to be mounted on the Email route
 */

const emailDonationId = async (req, res) => {
    let student_email = req.body.email;
    let teacher_name = req.body.teacher_name;
    const subject = 'Requested Donation Code';
    let student = await Student.findOne({ email: student_email });
    let message = `Your Donation Code is ${student.donation_code}. Thank you for your donation.\n${teacher_name}`;
    const htmlContent = {
        student_email: student_email,
        teacher_name: teacher_name,
        plainTextMessage: message,
        student: student,
        donationUrl: donationUrl,
    };
    // Send email as templated HTML and plain text
    sendHTMLEmail(student_email, subject, htmlContent, message, 'donationId');
};

const emailAfterSubmitDonation = async (req, res) => {
    let student_email = req.body.email;
    let teacher_name = req.body.teacherName;
    let student_name = req.body.studentName;
    let donation_code = req.body.donationCode;
    let studentDonations = '';
    let count = 0;
    req.body.studentDonations.forEach((donation) => {
        count++;
        studentDonations += donation;
        if (count < req.body.studentDonations.length) {
            studentDonations += ', ';
        }
    });

    let message = `Hello ${student_name},
    
    Thank you so much for your donation of the following:
    ${studentDonations}
    If you would like to update your donation, your Donation Code is ${donation_code}.

    Best,
    ${teacher_name}`;

    const subject = 'Donation confirmation';
    const htmlContent = {
        ...req.body,
    };
    sendHTMLEmail(student_email, subject, htmlContent, message, 'donations');
};

export default { emailDonationId, emailAfterSubmitDonation };
