const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(liveStatus, emailToSend, website) {
    this.to = emailToSend;
    this.website = website;
    this.liveStatus = liveStatus;
    this.from = `Anuj Sharma <mailtoanuj21@gmail.com>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the email
  async send(template, subject) {
    //1) Render HTML based on Pug
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        website: this.website,
        liveStatus: this.liveStatus,
        subject,
      }
    );
    //2) Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    console.log(this.liveStatus);
    // Create transport and sent email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWebStatus() {
    await this.send("sendStatus", "Live Status of Website");
  }
};
