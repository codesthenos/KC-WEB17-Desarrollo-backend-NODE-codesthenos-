// import { z } from 'zod'
// import { loginSchema } from '../lib/validatorSchemas.js'
// import { handleLoginValidationError } from '../lib/zodErrorHandlers.js'
import { setLocals, REGISTER_TITLE as title } from '../lib/config.js'
import { User } from '../models/User.js'

export const getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/')
  setLocals(res, { title })
  res.render('login-register')
}

export const postRegister = async (req, res, next) => {
  try {
    // get form data
    const { email, password } = req.body
    // validate for data
    // loginSchema.parse(req.body)
    // normalize email
    const normalizedEmail = email.toLowerCase().trim()
    // check if there is a REGISTERED user in the MongoDB
    const user = await User.findOne({ email: normalizedEmail })
    if (user) {
      setLocals(res, { title, email, error: '   ERROR: This email is already REGISTERED' })
      res.render('login-register')
      return
    }
    // create new User with hashed pass
    const newUser = new User({
      email: normalizedEmail,
      password: await User.hashPassword(password)
    })
    // store it in the database, and in a variable to automatically login the user
    const savedUser = await newUser.save()
    // automatically login
    req.session.userId = savedUser._id
    req.session.email = savedUser.email
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
