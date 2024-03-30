const { environment } = require('../configs/app.config')
const mongoConnect = require('../db')
switch (environment) {
  case 'dev':
    module.exports = require('../DAO/memory/user-memory.dao')
    break

  case 'prod':
    module.exports = require('../DAO/mongo/user-dao.mongo')
    break

  default:
    break
}  
