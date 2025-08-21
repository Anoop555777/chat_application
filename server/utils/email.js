const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const fs = require('fs');
const path = require('path');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.fullname.split(' ')[0];
    this.url = url;
    this.from = 'Anoop Singh <ajbisht99@gmail.com>';
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      // secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //render html
    const templatePath = path.join(__dirname, `../ui/${template}.html`);

    let html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace(/{%NAME%}/g, this.firstname);
    html = html.replace(/{%URL%}/g, this.url);

    //define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOptions);
    //create a transport and send email to
  }

  async sendVerify() {
    await this.send('verify', `Welcome to CHATAJ ${this.firstname}`);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'your password reset token valid for 10 min only'
    );
  }
};
