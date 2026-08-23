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
indexRouter.get('/admin', passport.authenticate('jwt', { session: false }), indexController.getAdminCheck)
indexRouter.get('/message', passport.authenticate('jwt', { session: false }), indexController.getMessage)

indexRouter.post('/register', indexController.postRegister)
indexRouter.post('/login', indexController.postLogin)
indexRouter.post('/member', passport.authenticate('jwt', { session: false }),  indexController.postMemberCheck)
indexRouter.post('/logout', indexController.postLogout)
indexRouter.post('/admin', passport.authenticate('jwt', { session: false }),  indexController.postAdminCheck)
indexRouter.post('/message', passport.authenticate('jwt', { session: false }), indexController.postMessage)

indexRouter.post('/messages/delete/:id', passport.authenticate('jwt', { session: false }), indexController.deleteMessage)

module.exports = indexRouter