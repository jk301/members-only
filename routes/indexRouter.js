// routes/indexRouter.js

const { Router } = require('express')
const indexController = require('../controllers/indexController.js')
const passport = require('passport')
const midware = require('../midware/optAuth')

const indexRouter = Router()

indexRouter.get('/', midware.optAuthCheck, indexController.getMainPage)
indexRouter.get('/register', indexController.getRegister)
indexRouter.get('/login', indexController.getLogin)
indexRouter.get('/member', passport.authenticate('jwt', { session: false }), indexController.getMemberCheck)

indexRouter.post('/register', indexController.postRegister)
indexRouter.post('/login', indexController.postLogin)
indexRouter.post('/member', passport.authenticate('jwt', { session: false }),  indexController.postMemberCheck)
indexRouter.post('/logout', indexController.postLogout)

module.exports = indexRouter