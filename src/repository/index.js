const UsersRepository = require('../repository/users.repository')
//const UsersMongoDao = require('../DAO/mongo/user-dao.mongo')
const UsersFactory=require('../factory/users.factory')
const usersRepository = new UsersRepository(new UsersFactory())

module.exports = usersRepository