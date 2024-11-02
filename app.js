import { join } from 'node:path'
import express from 'express'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import homeController from './controllers/homeController.js'

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

// Routing

// homepage
app.use('/', homeController)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.DEBUG ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
