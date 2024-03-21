class UserDAO {
  users = []

  async tomaTodo() {
    console.log('usuarios desde el memory')
    return this.users
  }

  async creamosUno(newUserInfo) {
    console.log('Creado desde el DAO memory')
    this.users.push(newUserInfo)
    return 'Nuevo usuario creado'
  }
}

module.exports = UserDAO