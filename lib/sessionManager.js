import session from 'express-session'
import MongoStore from 'connect-mongo'
import { MONGO_URI, SESSION_SECRET } from './secret.js'
import { SESSION_COOKIE_DURATION, SESSION_COOKIE_NAME } from './config.js'

// middleware to create the SESSION info and store it in the MongoDB
export const sessionMiddleware = session({
  name: SESSION_COOKIE_NAME,
  secret: SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: SESSION_COOKIE_DURATION },
  store: MongoStore.create({ mongoUrl: MONGO_URI })
})

// middleware to store the SESSION info in the LOCAL VARIABLES (so that views can access them)
export const setSessionLocalsMiddleware = (req, res, next) => {
  res.locals.session = req.session
  next()
}

// middleware to check if the user is logged
export const isLogged = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login')
  next()
}
