import { APP_TITLE } from '../lib/config.js'
import { Product } from '../models/Product.js'

const index = async (req, res, next) => {
  res.locals.title = APP_TITLE
  if (req.session.userId) {
    res.locals.products = await Product.find({ owner: req.session.userId })
    res.locals.headerLinkHref = '/logout'
    res.locals.headerLinkText = 'LOGOUT'
  } else {
    res.locals.headerLinkHref = '/login'
    res.locals.headerLinkText = 'LOGIN'
  }
  res.render('home')
}

export default index
