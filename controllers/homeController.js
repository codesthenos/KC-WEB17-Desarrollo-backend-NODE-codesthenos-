import { APP_TITLE, CURRENT_PAGE, validateQueryPrice, normalizePriceMongo, validateQuerySort, normalizeSortMongo, validateQueryTag, normalizeURL, PRODUCTS_PER_PAGE, setLocals } from '../lib/config.js'
import { Product } from '../models/Product.js'

const index = async (req, res, next) => {
  // init locals
  setLocals(res, { title: APP_TITLE })
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
    const filters = { owner }
    const options = {}
    // declare list filters, options and locals with validation
    // name
    if (name) {
      filters.name = new RegExp(`^${name}`, 'i')
      res.locals.name = name
    }
    // price
    if (price) {
      res.locals.price = validateQueryPrice(price)
      filters.price = normalizePriceMongo(price)
    }
    // tag
    if (tag) {
      const normalizedTag = validateQueryTag(tag)
      filters.tags = normalizedTag
      res.locals.tag = normalizedTag
    }
    // sort
    if (sort) {
      res.locals.sort = validateQuerySort(sort)
      options.sort = normalizeSortMongo(sort)
    }
    // Generating URLS
    const currentParams = { skip, limit, name, price, tag, sort }
    // sorting nav locals if user logged
    res.locals.hrefNameSortAtoZ = normalizeURL({ ...currentParams, sort: 'name' })
    res.locals.hrefNameSortZtoA = normalizeURL({ ...currentParams, sort: 'name-1' })
    // sorting price nav locals
    res.locals.hrefPriceSortASC = normalizeURL({ ...currentParams, sort: 'price' })
    res.locals.hrefPriceSortDES = normalizeURL({ ...currentParams, sort: 'price-1' })
    // unsort nav local
    res.locals.hrefUnsort = normalizeURL({ ...currentParams, sort: '' })
    // locals for UNSET filters
    res.locals.hrefNameUnsetFilter = normalizeURL({ ...currentParams, name: '' })
    res.locals.hrefPriceUnsetFilter = normalizeURL({ ...currentParams, price: '' })
    res.locals.hrefTagUnsetFilter = normalizeURL({ ...currentParams, tag: '' })
    // PAGINATION behaviour if we got in url only one, skip or limit
    if ((!limit && skip) || (limit && !skip)) {
      res.redirect(normalizeURL({ name, price, tag, sort }))
      return
    }
    // PAGINATION behaviour if we got in url skip and limit
    if (skip && limit) {
      const normalizedLimit = Math.abs(+limit)
      options.skip = skip
      options.limit = normalizedLimit
      res.locals.skip = skip
      res.locals.limit = normalizedLimit
      // next page button
      res.locals.nextPage = +skip + normalizedLimit
      res.locals.hrefNextPage = normalizeURL({ skip: res.locals.nextPage, limit: normalizedLimit, name, price, tag, sort })
      // previous page button
      res.locals.previousPage = +skip - normalizedLimit < 0 ? 0 : +skip - normalizedLimit
      res.locals.hrefPreviousPage = normalizeURL({ skip: res.locals.previousPage, limit: normalizedLimit, name, price, tag, sort })
      // show all button
      res.locals.hrefShowAll = normalizeURL({ name, price, tag, sort })
    }
    // 3 by 3 button     PAGINATION locals.hrefPaginate if dont have either skip and limit
    res.locals.hrefPaginate = normalizeURL({ skip: CURRENT_PAGE, limit: PRODUCTS_PER_PAGE, name, price, tag, sort })
    // total products length stored in a local
    res.locals.productsLength = await Product.countDocuments(filters)
    // list of products stored in a local
    res.locals.products = await Product.list({ filters, options })

    res.render('home')
  } catch (error) {
    if (error.message === '400 BAD REQUEST | ERROR in URL: PRICE query param should match <number>-<number> pattern') {
      setLocals(res, {
        title: APP_TITLE,
        headerLinkHref: '/logout',
        headerLinkText: 'LOGOUT',
        ...req.query,
        price: 'PRICE has to match <number>-<number> pattern, example: 50-200',
        hrefNameSortAtoZ: normalizeURL({ ...req.query, sort: 'name' }),
        hrefNameSortZtoA: normalizeURL({ ...req.query, sort: 'name-1' }),
        hrefPriceSortASC: normalizeURL({ ...req.query, sort: 'price' }),
        hrefPriceSortDES: normalizeURL({ ...req.query, sort: 'price-1' }),
        hrefUnsort: normalizeURL({ ...req.query, sort: '' }),
        hrefNameUnsetFilter: normalizeURL({ ...req.query, name: '' }),
        hrefPriceUnsetFilter: normalizeURL({ ...req.query, price: '' }),
        hrefTagUnsetFilter: normalizeURL({ ...req.query, tag: '' }),
        nextPage: +req.query.skip + Math.abs(+req.query.limit),
        hrefNextPage: normalizeURL({ ...req.query, skip: +req.query.skip + Math.abs(+req.query.limit), limit: Math.abs(+req.query.limit) }),
        previousPage: +req.query.skip - Math.abs(+req.query.limit) < 0 ? 0 : +req.query.skip - Math.abs(+req.query.limit),
        hrefPreviousPage: normalizeURL({ ...req.query, skip: +req.query.skip - Math.abs(+req.query.limit) < 0 ? 0 : +req.query.skip - Math.abs(+req.query.limit), limit: Math.abs(+req.query.limit) }),
        hrefShowAll: normalizeURL({ name: req.query.name, price: req.query.price, tag: req.query.tag, sort: req.query.sort }),
        hrefPaginate: normalizeURL({ ...req.query, skip: CURRENT_PAGE, limit: PRODUCTS_PER_PAGE })
      })
      res.render('home')
    }
    next(error)
  }
}

export default index
