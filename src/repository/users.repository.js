class UsersRepository {
  constructor(usersMongoDao) {
    this.dao = usersMongoDao;
  }

  async get() {
    return await this.dao.get();
  }

  async create(newUserInfo) {
    await this.dao.create(newUserInfo);
  }
  
  async findOne(query) {
    return await this.dao.findOne(query);
  }
  async updatedatos(user) {
    await user.save();
  }
}

module.exports = UsersRepository;
