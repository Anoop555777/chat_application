const twilio = require("twilio");

module.exports = class SentOTP {
  constructor(to, from, message) {
    this.to = to;
    this.from = from;
    this.message = message;
  }

  async createMessage() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: this.message,
      from: this.from,
      to: this.to,
    });
  }
};
