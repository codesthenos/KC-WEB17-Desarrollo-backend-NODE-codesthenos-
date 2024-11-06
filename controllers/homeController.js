import { APP_TITLE } from '../lib/config.js'
import { Product } from '../models/Product.js'

const index = async (req, res, next) => {
  res.locals.title = APP_TITLE
  if (!req.session.userId) {
    res.locals.headerLinkHref = '/login'
    res.locals.headerLinkText = 'LOGIN'
    res.render('home')
    return
  }
  try {
    // get { limit, skip } query params
    const { limit, skip } = req.query
    // handle malicious client for pagination with the URL
    if ((!limit && skip) || (limit && !skip)) {
      res.redirect('/')
      return
    }

    // get userID from session
    const owner = req.session.userId
    // comporbacion de usuario correcto
    // validacion de schema zod
    // comprobaciones de todos los query params, que pasa si metemos a capon cosas raras
    // local with queryparams
    res.locals.queryParams = { limit: Math.abs(limit), skip }
    // total products length
    res.locals.productsLength = await Product.countDocuments({ owner })
    // list of products
    res.locals.products = await Product.list({ filters: { owner }, options: { skip, limit } })
    res.locals.headerLinkHref = '/logout'
    res.locals.headerLinkText = 'LOGOUT'

    res.render('home')
  } catch (error) {
    // usar zod error handler
    next(error)
  }
}

export default index
