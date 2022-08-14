const nodemailer = require("nodemailer");
const config = require("../config-env/config-env");
// const ejs = require("ejs");
// const path = require("path");

const sendEmail = async (email, subject, text) => {
  // const requiredPath = path.join(__dirname, "../views/email.ejs");

  // const data = await ejs.renderFile(requiredPath);

  try {
    const transporter = nodemailer.createTransport({
      service: config.nodeMailer.service,
      auth: {
        user: config.nodeMailer.user,
        pass: config.nodeMailer.pass,
      },
    });

    const info = await transporter.sendMail({
      from: config.nodeMailer.from,
      to: email, // list of receivers
      subject: subject,
      text: text,
      // html: data,
    });
    nodemailer.getTestMessageUrl(info);
    console.log("email sent successfully");
  } catch (error) {
    console.log("email sent error: " + error);
  }
};

module.exports = sendEmail;
