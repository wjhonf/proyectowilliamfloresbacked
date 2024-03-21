const { createHash, useValidPassword } = require('../utils/crypt-password.util')
class NewUserDto{
    constructor(newUserInfo)
    {
        this.first_name=newUserInfo.first_name
        this.last_name=newUserInfo.last_name
        this.email=newUserInfo.email
        this.password= createHash(newUserInfo.password)
        this.role=newUserInfo.role
    }
}
module.exports= NewUserDto
