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
    let mailOptions = {
        from: 'tsdcapstone@gmail.com',
        to: req.body.recipient,
        subject: req.body.subject,
        text: req.body.text
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
