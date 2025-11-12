const Router = require('express')
const UserController = require('./user-controller')
const userRouter = new Router()

userRouter.post('/login', UserController.login)
userRouter.post('/registration', UserController.registration)
userRouter.post('/logout', UserController.logout)
userRouter.get('/refresh', UserController.refresh)

module.exports = userRouter