/*const UsersRepository = require('../repository/users.repository')
//const UsersMongoDao = require('../DAO/mongo/user-dao.mongo')
const UsersFactory=require('../factory/users.factory')
const usersRepository = new UsersRepository(new UsersFactory())

module.exports = usersRepository*/

// src/repository/index.js
const UserDAO = require('../factory/users.factory');
const UsersRepository =require('../factory/users.factory')

const usersRepository = new UsersRepository(new UserDAO());

module.exports = usersRepository;
