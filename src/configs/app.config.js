require('dotenv').config()
module.exports = {
  environment: process.env.NODE_ENV || 'prod',
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  ghClientId: process.env.GH_CLIENT_ID,
  ghClientSecret: process.env.GH_CLIENT_SECRET,
  port:process.env.PORT,
  email:{
    identifier: process.env.SEND_MESSAGE_EMAIL,
    password: process.env.SEND_MESSAGE_EMAIL_PASSWORD,
  },
  sms: {
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAccountToken: process.env.TWILIO_ACCOUNT_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
  },

}