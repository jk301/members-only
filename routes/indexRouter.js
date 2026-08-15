// routes/indexRouter.js

const { Router } = require('express')
const indexController = require('../controllers/indexController.js')

const indexRouter = Router()

indexRouter.get('/', indexController.getMainPage)
indexRouter.get('/register', indexController.getRegister)
indexRouter.get('/login', indexController.getLogin)
indexRouter.get('/member', indexController.getMemberCheck)

indexRouter.post('/register', indexController.postRegister)
indexRouter.post('/login', indexController.postLogin)
indexRouter.post('/member', indexController.postMemberCheck)

module.exports = indexRouter