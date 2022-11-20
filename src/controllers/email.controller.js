"use strict";
import nodemailer from 'nodemailer';

/**
 * Controller function to be mounted on the Email route
*/

const send = async (req, res) => {
    console.log('inside email send function');
    let transporter = nodemailer.createTransport({
        host: "mail.google.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'tsdcapstone@gmail.com', 
            pass: 'frlnvucfltrtkavq', 
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"TSD" <tsdcapstone@example.com>', // sender address
        to: "alicefisher100.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    };

    // send mail with defined transport object
    let info  = await transporter.sendMail(mailOptions);

    
    if(error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    return res.status(201);

};


export default {send};