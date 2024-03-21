const { environment } = require('../configs/app.config')
const mongoConnect = require('../db')
switch (environment) {
  case 'dev':
    console.log('factory DAO memory')
    module.exports = require('../DAO/memory/user-memory.dao')
    break

  case 'prod':
    console.log('factory DAO mongo')
    
    module.exports = require('../DAO/mongo/user-dao.mongo')
    break

  default:
    break
}  
