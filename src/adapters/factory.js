const { environment } = require('../configs/app.config')
switch (environment) {
  case 'dev':
    module.exports = require('./mail.adapter')
    break
  case 'prod':
    module.exports = require('./sms.adapter')
    break
  default:
    break
}