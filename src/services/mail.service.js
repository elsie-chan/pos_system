import nodemailer from 'nodemailer';
import path from "path";
import {fileURLToPath} from "url";
import {variables} from "../configuration/index.js";
import ejs from 'ejs';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: variables.EMAIL_HOST,
    port: variables.EMAIL_PORT,
    secure: true,
    auth: {
        user: variables.EMAIL_USER,
        pass: variables.EMAIL_PASS
    }
})
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Ready for send emails');
    }
})

async function sendMail(name, text, template)
{
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename).slice(0, -13)
    ejs.renderFile(__dirname + '/src/views/mail/' + template, {email: name, token: text}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("hello")
            const mailOptions = {
                from: '"' + "Phone Store" + '"' + "<" + variables.EMAIL_USER + ">",
                to: name,
                subject: `Hello ${name}`,
                html: data
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                    return info
                }
            })
        }
    })
}

export default {
    sendMail
};