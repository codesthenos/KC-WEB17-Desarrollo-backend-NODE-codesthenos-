import { setLocals, REGISTER_TITLE as title } from '../lib/config.js'

export const getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/')
  setLocals(res, { title })
  res.render('login-register')
}

export const postRegister = () => {}
