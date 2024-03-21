const twilio = require('twilio');
const { sms } = require('../configs/app.config');

const client = twilio(sms.twilioAccountSid, sms.twilioAccountToken);

module.exports = client;

