const passport = require('passport')
const jwt = require('passport-jwt')
const cookieExtractor = require('../utils/cookie-extractor.util')
const local = require('passport-local')
const Users = require('../DAO/mongo/models/user.model')
const { createHash, useValidPassword } = require('../utils/crypt-password.util')
const GithubStrategy = require('passport-github2')
const { ghClientSecret, ghClientId } = require('./app.config')
const NewUserDto=require('../DTOs/new-user.dto')
/*const UsersMemoryDao= require ('../DAO/memory/user-memory.dao')
const UsersMongoDao = require('../DAO/mongo/user-dao.mongo')
//const Users= new  UsersMemoryDao()
const Users= new UsersMongoDao()*/

//const UsersFactory= require('../factory/users.factory')
//const Users= new UsersFactory()
//const Users= require('../repository')
const usersService= require('../services/users.service')
const JWTStrategy = jwt.Strategy
const LocalStrategy2 = local.Strategy
const initializePassport = () => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'mySecret',
      },
      (jwt_payload, done) => {
        try {
          done(null, jwt_payload)
        } catch (error) {
          done(error)
        }
      }
    )
  )
  passport.use(
    'register',
    new LocalStrategy2(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const user = await usersService.findOne({ email: username })
          if (user) {
            req.logger.info('Usuario ya exite')
            return done(null, false)
          }
          await usersService.createUser(req.body)
          const newUser = await usersService.findOne({ email: req.body.email });
          return done(null, newUser)
        } catch (error) {
          return done(error)
        }
      }
    )
  )
  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: ghClientId,
        clientSecret: ghClientSecret,
        callbackURL: 'http://localhost:8080/auth/githubcallback',
      },
      async (accessToken, RefreshToken, profile, done) => {
        try {

          const { id, login, name, email } = profile._json
          const user = await Users.findOne({ email: email })
          if (!user) {
            const newUserInfo = {
              first_name: name,
              email,
              githubId: id,
              githubUsername: login,
            }
            const newUser = await Users.create(newUserInfo)
            return done(null, newUser)

          }

          return done(null, user)
        } catch (error) {
          req.logger.error(error);
          done(error)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    req.logger.error(error);
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = Users.findById(id)
    done(null, user)
  })
}

module.exports = initializePassport