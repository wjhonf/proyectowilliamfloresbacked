const { environment } = require('../configs/app.config')
const mongoConnect = require('../db')
let UserDAO;
switch (environment) {
  case 'dev':
    UserDAO = require('../DAO/memory/user-memory.dao')
    break

  case 'prod':
    UserDAO = require('../DAO/mongo/user-dao.mongo')
    break

  default:
    throw new Error('Invalid environment configuration');

}  

module.exports = UserDAO;