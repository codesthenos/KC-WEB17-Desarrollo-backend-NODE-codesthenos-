// import { z } from 'zod'
// import { loginSchema } from '../lib/validatorSchemas.js'
// import { handleLoginValidationError } from '../lib/zodErrorHandlers.js'
import { LOGIN_TITLE as title, setLocals } from '../lib/config.js'
import { User } from '../models/User.js'

export const getLogin = async (req, res, next) => {
  if (req.session.userId) return res.redirect('/')
  setLocals(res, { title })
  res.render('login-register')
}

export const postLogin = async (req, res, next) => {
  try {
    // get form data
    const { email, password } = req.body
    // validate request body AT the end i had chose to create a middleware instead doing it here
    // loginSchema.parse(req.body)
    // normalize email
    const normalizedEmail = email.toLowerCase().trim()
    // search User with the email in the MongoDB
    const user = await User.findOne({ email: normalizedEmail })
    // check if there is a user in the MongoDB with the email gotten from the form
    if (!user) {
      setLocals(res, { title, email, error: '   Invalid email' })
      res.render('login-register')
      return
    }
    // If user found, check if password matches
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
      setLocals(res, { title, email, error: '   Invalid credentials' })
      res.render('login-register')
      return
    }
    // if user found and password matches create sesion locals
    req.session.userId = user._id
    req.session.email = user.email
    res.redirect('/')
  } catch (error) {
    /*
    if (error instanceof z.ZodError) {
      handleLoginValidationError(title, error, res, req.body.email)
    } else {
      next(error)
    }
    */
    next(error)
  }
}
