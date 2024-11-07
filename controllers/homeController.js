import { APP_TITLE, CURRENT_PAGE, normalizePriceFilter, normalizePriceLocal, normalizeSortLocal, normalizeSortMongo, normalizeTag, normalizeURL, PRODUCTS_PER_PAGE } from '../lib/config.js'
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
  res.locals.nextPage = 0
  res.locals.hrefNextPage = ''
  res.locals.previousPage = 0
  res.locals.hrefPreviousPage = ''
  res.locals.hrefPaginate = ''
  // behaviour is there is no user logged in
  if (!req.session.userId) {
    // header locals
    res.locals.headerLinkHref = '/login'
    res.locals.headerLinkText = 'LOGIN'
    res.render('home')
    return
  }
  // behaviour if there is a user logged in
  try {
    // header locals
    res.locals.headerLinkHref = '/logout'
    res.locals.headerLinkText = 'LOGOUT'
    // get userID from session
    const owner = req.session.userId
    // get query params
    const { limit, skip, sort, name, price, tag } = req.query
    // init filters and option for the list of products
    const filters = {}
    const options = {}
    // declare list filters, options and locals with validation
    filters.owner = owner
    // name
    if (name) {
      filters.name = new RegExp(`^${name}`, 'i')
      res.locals.name = name
    }
    // price
    if (price) {
      filters.price = normalizePriceFilter(price)
      res.locals.price = normalizePriceLocal(price)
    }
    // tag
    if (tag) {
      const normalizedTag = normalizeTag(tag)
      filters.tags = { $in: [normalizedTag] }
      res.locals.tag = normalizedTag
    }
    // sort
    if (sort) {
      options.sort = normalizeSortMongo(sort)
      res.locals.sort = normalizeSortLocal(sort)
    }
    // PAGINATION behaviour if we got in url only one, skip or limit
    if ((!limit && skip) || (limit && !skip)) {
      const normalizedUrl = normalizeURL({ name, price, tag, sort })
      if (!normalizedUrl) return res.redirect('/')
      res.redirect(`/?${normalizedUrl}`)
      return
    }
    // PAGINATION behaviour if we got in url skip and limit
    if (skip && limit) {
      const normalizedLimit = Math.abs(+limit)
      options.skip = skip
      options.limit = normalizedLimit
      res.locals.skip = skip
      res.locals.limit = normalizedLimit

      res.locals.nextPage = +skip + normalizedLimit
      res.locals.hrefNextPage = `/?${normalizeURL({ skip: res.locals.nextPage, limit: normalizedLimit, name, price, tag, sort })}`

      res.locals.previousPage = +skip - normalizedLimit < 0 ? 0 : +skip - normalizedLimit
      res.locals.hrefPreviousPage = `/?${normalizeURL({ skip: res.locals.previousPage, limit: normalizedLimit, name, price, tag, sort })}`
    }
    // PAGINATION locals.hrefPaginate if dont have either skip and limit
    res.locals.hrefPaginate = `/?${normalizeURL({ skip: CURRENT_PAGE, limit: PRODUCTS_PER_PAGE, name, price, tag, sort })}`
    // total products length stored in a local
    res.locals.productsLength = await Product.countDocuments(filters)
    // list of products stored in a local
    res.locals.products = await Product.list({ filters, options })

    res.render('home')
  } catch (error) {
    // usar zod error handler
    next(error)
  }
}

export default index
