const User = require('../mongo/models/user.model')
class usersMongoDao {
  async get() {
    return await User.find()
  }

  async create(newUserInfo) {
    return await User.create(newUserInfo)
  }
  async findOne(query) {
    return await User.findById(query);
  }
  async updatedatos(user) {
    await user.save();
  }
}


module.exports = usersMongoDao