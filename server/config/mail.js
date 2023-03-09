const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
	service: "gmail",
	auth: {
		user: "wallsyncapp@gmail.com",
		pass: process.env.MAIL_PASSWORD,
	},
});

module.exports = transporter;
