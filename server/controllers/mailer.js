import nodemailer from "nodemailer";
import MailGen from "mailgen";

import ENV from "../config.js";

let nodeConfig = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig)

let MailGenerator = new MailGen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;
    
    //body of email
    var email = {
        body: {
            name: username,
            intro: text || 'Hello Iam Gasal and this is a test Authentication setup',
            outro: 'Need Help, or have questions? just reply to this mail I\'d love to help..'
        }
    }

    var emailBody = MailGenerator.generate(email)

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || 'Signup Successfull',
        html: emailBody
    }

    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You will soon receive a mail from us.."})
        })
        .catch(err => res.status(500).send({ err }))
}