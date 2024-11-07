import { APP_TITLE, normalizePriceFilter } from '../lib/config.js'
import { Product } from '../models/Product.js'

const index = async (req, res, next) => {
  // init locals
  res.locals.title = APP_TITLE
  res.locals.skip = ''
  res.locals.limit = ''
  res.locals.name = ''
  res.locals.price = ''
  res.locals.tag = ''
  res.locals.sort = ''
  if (!req.session.userId) {
    res.locals.headerLinkHref = '/login'
    res.locals.headerLinkText = 'LOGIN'
    res.render('home')
    return
  }
  try {
    // get userID from session
    const owner = req.session.userId
    // get { limit, skip } query params
    const { limit, skip, sort, name, price, tag } = req.query
    // handle malicious client for pagination with the URL
    if ((!limit && skip) || (limit && !skip)) {
      const redirectQuery = {}
      if (name) redirectQuery.name = `name=${name}`
      if (price) redirectQuery.price = `price=${price}`
      if (tag) redirectQuery.tag = `tag=${tag}`
      if (sort) redirectQuery.sort = `sort=${sort}`
      if (Object.values(redirectQuery).length === 0) return res.redirect('/')

      res.redirect(`/?${Object.values(redirectQuery).join('&')}`)
      return
    }
    console.log(price)
    // declare list filters and locals
    const filters = {}
    filters.owner = owner
    if (name) {
      filters.name = new RegExp(`^${name}`, 'i')
      res.locals.name = name
    }
    if (price) {
      const normalizedPrice = normalizePriceFilter(price)
      filters.price = normalizedPrice
      res.locals.price = normalizedPrice
    }
    if (tag) {
      filters.tag = tag
      res.locals.tag = tag
    }
    // declare list options and locals
    const options = {}
    if (skip) {
      options.skip = skip
      res.locals.skip = skip
    }
    if (limit) {
      options.limit = limit
      res.locals.limit = Math.abs(limit)
    }
    if (sort) {
      options.sort = sort
      res.locals.sort = sort
    }
    // validacion de schema zod
    // comprobaciones de todos los query params, que pasa si metemos a capon cosas raras

    // total products length stored in a local
    res.locals.productsLength = await Product.countDocuments(filters)
    // list of products stored in a local
    res.locals.products = await Product.list({ filters, options })
    res.locals.headerLinkHref = '/logout'
    res.locals.headerLinkText = 'LOGOUT'

    res.render('home')
  } catch (error) {
    // usar zod error handler
    next(error)
  }
}

export default index
