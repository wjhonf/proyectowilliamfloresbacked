
const UserDAO = require('../factory/users.factory');
const UsersRepository =require('../factory/users.factory')

const usersRepository = new UsersRepository(new UserDAO());

module.exports = usersRepository;
