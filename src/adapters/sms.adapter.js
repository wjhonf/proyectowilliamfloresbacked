const { sms } = require('../configs/app.config')
const client = require('../utils/twilio.util')

class SmsAdapter {
  async sendMessage(messageInfo) {
    await client.messages.create({
      body: `Hola ${messageInfo.name} bienvenido a nuestro sitio`,
      from: sms.twilioSmsNumber,
      to: messageInfo.phone,
    })
  }
}

module.exports = SmsAdapter