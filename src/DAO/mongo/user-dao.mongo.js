const User = require('../mongo/models/user.model')
class usersMongoDao {
  async get() {
    return await User.find()
  }

  async create(newUserInfo) {
    console.log('Creado desde el DAO')
    return await User.create(newUserInfo)
  }
  async findOne(query) {
    console.log('Buscando usuario desde el DAO');
    return await User.findOne(query);
  }
  
}


module.exports = usersMongoDao