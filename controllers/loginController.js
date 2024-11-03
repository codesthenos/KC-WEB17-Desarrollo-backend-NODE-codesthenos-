import { setupLoginLocals } from '../lib/config.js'
import { User } from '../models/User.js'

export const getLogin = async (req, res, next) => {
  if (req.session.userId) return res.redirect('/')
  setupLoginLocals(res)
  res.render('login')
}

export const postLogin = async (req, res, next) => {
  try {
    // get form data
    const { email, password } = req.body
    // normalize email
    const normalizedEmail = email.toLowerCase().trim()
    // search User with the email in the MongoDB
    const user = await User.findOne({ email: normalizedEmail })
    // check if there is a user in the MongoDB with the email gotten from the form
    if (!user) {
      setupLoginLocals(res, { error: 'Invalid email', email })
      res.render('login')
      return
    }
    // If user found, check if password matches
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
      setupLoginLocals(res, { error: 'Invalid credentials', email })
      res.render('login')
      return
    }
    // if user found and password matches create sesion locals
    req.session.userId = user._id
    req.session.email = user.email
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}
