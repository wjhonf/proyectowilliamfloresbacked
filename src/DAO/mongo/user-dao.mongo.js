const User = require('../mongo/models/user.model')
class usersMongoDao {
  async get() {
    return await User.find()
  }

  async create(newUserInfo) {
    return await User.create(newUserInfo)
  }
  async findOne(query) {
    return await User.findOne(query);
  }
  
}


module.exports = usersMongoDao