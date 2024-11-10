import { join } from 'node:path'
import express from 'express'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
// session managers
import { isLogged, sessionMiddleware, setSessionLocalsMiddleware } from './lib/sessionManager.js'
// controllers
import homeController from './controllers/homeController.js'
import { getLogin, postLogin } from './controllers/loginController.js'
import logoutController from './controllers/logoutController.js'
import { getRegister, postRegister } from './controllers/registerController.js'
import { deleteProduct, getCreateProduct, postCreateProduct, getUpdateProduct, postUpdateProduct } from './controllers/productsController.js'
import { createProductValidatorMiddleware, loginSchema, updateProductValidatorMiddleware, validatorMiddleware } from './lib/validatorSchemas.js'
import { LOGIN_TITLE, REGISTER_TITLE } from './lib/config.js'
import { handleLoginValidationError } from './lib/zodErrorHandlers.js'

const app = express()

// view engine setup
app.set('views', join(import.meta.dirname, 'views'))
app.set('view engine', 'ejs')

// middlewares

// morgan logger for http requests logs
app.use(logger('dev'))
// transforms json objects into js objects
app.use(express.json())
// transforms data sent by a form to a js object
app.use(express.urlencoded({ extended: false }))
// cookie parser to get cookies from client
app.use(cookieParser())
// set the folder where statis resources will be served
app.use(express.static(join(import.meta.dirname, 'public')))

// Session manger middlewares
app.use(sessionMiddleware, setSessionLocalsMiddleware)

// Routing

// homepage
app.get('/', homeController)
/* Users */
// login
app.get('/login', getLogin)
app.post('/login', validatorMiddleware({ title: LOGIN_TITLE, schema: loginSchema, errorHandler: handleLoginValidationError }), postLogin)
// logout
app.all('/logout', logoutController)
// register
app.get('/register', getRegister)
app.post('/register', validatorMiddleware({ title: REGISTER_TITLE, schema: loginSchema, errorHandler: handleLoginValidationError }), postRegister)

/* Products */
// create
app.get('/create-product', isLogged, getCreateProduct)
app.post('/create-product', isLogged, createProductValidatorMiddleware, postCreateProduct)
// delete
app.get('/delete-product/:id', isLogged, deleteProduct)
// update
app.get('/update-product/:id', isLogged, getUpdateProduct)
app.post('/update-product/:id', isLogged, updateProductValidatorMiddleware, postUpdateProduct)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.DEBUG ? err : {}
  res.locals.title = 'ERROR NODEPOP'

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
