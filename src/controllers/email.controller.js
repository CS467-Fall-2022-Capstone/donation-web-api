import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

/**
 * Controller function to be mounted on the Email route
*/


const send = async (req,res) => {
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'tsdcapstone@gmail.com',
            pass: 'frlnvucfltrtkavq'
        }
    }));
    const message = `Dear ${req.body.student_name},\nThank you for your donation! Your donation ID is ${req.body.student_id}.\nBest,\n${req.body.teacher_name}`;
    let mailOptions = {
        from: 'tsdcapstone@gmail.com',
        to: req.body.recipients,
        subject: req.body.subject,
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

export default { send };
