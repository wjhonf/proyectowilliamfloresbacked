class UserDAO {
  users = []

  async tomaTodo() {
    return this.users
  }
  async creamosUno(newUserInfo) {
    this.users.push(newUserInfo)
    return 'Nuevo usuario creado'
  }
}

module.exports = UserDAO