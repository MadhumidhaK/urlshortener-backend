const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const sgOptions = {
    auth : {
        api_key: process.env.mail_api_key
    }
}

exports.transport = nodemailer.createTransport(sgTransport(sgOptions));