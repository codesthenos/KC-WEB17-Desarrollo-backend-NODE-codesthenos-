import { APP_TITLE, CURRENT_PAGE, normalizePriceMongo, validateQuerySort, normalizeSortMongo, validateQueryTag, normalizeURL, PRODUCTS_PER_PAGE, setLocals, validateQueryPrice, normalizedPrice } from '../lib/config.js'
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
    const { limit, skip, sort, name, price, tag, priceMin, priceMax, priceExact } = req.query
    // init options for sorting and pagination
    const options = {}
    // Generating URLS
    const currentParams = { skip, limit, name, price, tag, sort, priceMin, priceMax, priceExact }
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
    res.locals.hrefPriceMinMaxUnsetFilter = normalizeURL({ ...currentParams, priceMin: '', priceMax: '' })
    res.locals.hrefPriceExactUnsetFilter = normalizeURL({ ...currentParams, priceExact: '' })
    res.locals.hrefTagUnsetFilter = normalizeURL({ ...currentParams, tag: '' })
    // PAGINATION behaviour if we got in url only one, skip or limit
    if ((!limit && skip) || (limit && !skip)) {
      res.redirect(normalizeURL({ ...currentParams, skip: undefined, limit: undefined }))
      return
    }
    // PAGINATION behaviour if we got in url skip and limit
    if (skip && limit) {
      const normalizedLimit = Math.abs(+limit)
      const normalizedSkip = Math.abs(+skip)
      if (isNaN(normalizedLimit) || isNaN(normalizedSkip)) return res.redirect(normalizeURL({ ...currentParams, skip: undefined, limit: undefined }))
      options.skip = normalizedSkip
      options.limit = normalizedLimit
      res.locals.skip = normalizedSkip
      res.locals.limit = normalizedLimit
      // next page button
      res.locals.nextPage = +normalizedSkip + normalizedLimit
      res.locals.hrefNextPage = normalizeURL({ ...currentParams, skip: res.locals.nextPage, limit: normalizedLimit })
      // previous page button
      res.locals.previousPage = +normalizedSkip - normalizedLimit < 0 ? 0 : +normalizedSkip - normalizedLimit
      res.locals.hrefPreviousPage = normalizeURL({ ...currentParams, skip: res.locals.previousPage, limit: normalizedLimit })
      // show all button
      res.locals.hrefShowAll = normalizeURL({ name, price, tag, sort, priceMin, priceMax, priceExact })
    }
    // 3 by 3 button     PAGINATION locals.hrefPaginate if dont have either skip and limit
    res.locals.hrefPaginate = normalizeURL({ ...currentParams, skip: CURRENT_PAGE, limit: PRODUCTS_PER_PAGE })
    // init filters
    const filters = { owner }
    // declare list filters, options and locals with validation
    // name
    if (name) {
      filters.name = new RegExp(`^${name}`, 'i')
      res.locals.name = name
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
    // price If someone add the query param 'price' manually to the url, it will delete the priceMin/Max/exact if exists and use only price query param to filter
    if (price && (priceMin || priceMax || priceExact)) {
      res.redirect(normalizeURL({ ...currentParams, priceMin: '', priceMax: '', priceExact: '' }))
      return
    }
    if (price) {
      const validatedPrice = validateQueryPrice(price)
      res.locals.price = validatedPrice
      res.locals.priceView = validatedPrice
      filters.price = normalizePriceMongo(validatedPrice)
    }
    if (!price && (priceMin || priceMax || priceExact)) {
      res.locals.priceMin = priceMin
      res.locals.priceMax = priceMax
      res.locals.priceExact = priceExact
      const validatedPrice = normalizedPrice({ priceMin, priceMax, priceExact })
      res.locals.priceView = validatedPrice
      filters.price = normalizePriceMongo(normalizedPrice({ priceMin, priceMax, priceExact }))
    }

    // total products length stored in a local
    res.locals.productsLength = await Product.countDocuments(filters)
    // list of products stored in a local
    res.locals.products = await Product.list({ filters, options })

    res.render('home')
  } catch (error) {
    setLocals(res, {
      title: APP_TITLE,
      headerLinkHref: '/logout',
      headerLinkText: 'LOGOUT',
      ...req.query,
      hrefNameSortAtoZ: normalizeURL({ ...req.query, sort: 'name' }),
      hrefNameSortZtoA: normalizeURL({ ...req.query, sort: 'name-1' }),
      hrefPriceSortASC: normalizeURL({ ...req.query, sort: 'price' }),
      hrefPriceSortDES: normalizeURL({ ...req.query, sort: 'price-1' }),
      hrefUnsort: normalizeURL({ ...req.query, sort: '' }),
      hrefNameUnsetFilter: normalizeURL({ ...req.query, name: '' }),
      hrefPriceMinMaxUnsetFilter: normalizeURL({ ...req.query, priceMin: '', priceMax: '' }),
      hrefPriceExactUnsetFilter: normalizeURL({ ...req.query, priceExact: '' }),
      hrefTagUnsetFilter: normalizeURL({ ...req.query, tag: '' }),
      nextPage: +req.query.skip + Math.abs(+req.query.limit),
      hrefNextPage: normalizeURL({ ...req.query, skip: +req.query.skip + Math.abs(+req.query.limit), limit: Math.abs(+req.query.limit) }),
      previousPage: +req.query.skip - Math.abs(+req.query.limit) < 0 ? 0 : +req.query.skip - Math.abs(+req.query.limit),
      hrefPreviousPage: normalizeURL({ ...req.query, skip: +req.query.skip - Math.abs(+req.query.limit) < 0 ? 0 : +req.query.skip - Math.abs(+req.query.limit), limit: Math.abs(+req.query.limit) }),
      hrefShowAll: normalizeURL({ name: req.query.name, price: req.query.price, tag: req.query.tag, sort: req.query.sort }),
      hrefPaginate: normalizeURL({ ...req.query, skip: CURRENT_PAGE, limit: PRODUCTS_PER_PAGE })
    })
    if (error.message === '400 BAD REQUEST | ERROR in URL: PRICE query param should match <number>-<number> pattern') {
      res.locals.errorURL = 'IF YOU WANNA PLAY DIRECTLY WITH THE URL QUERY PARAMS\n\nprice MUST MATCH ONE OF THE FOLLOWING PATTERNS\n    <number> | <number>- | -<number> | <number>-<number>\n\nOR\n\npriceMin >= 1 | priceMax > 0 | priceExact > 0'
      res.render('home')
      return
    } else if (error.message === '400 BAD REQUEST | ERROR PRICE: FAILED ON: PRICE MIN >= 0 | PRICE MAX > 0 | PRICE EXACT > 0') {
      res.locals.error = 'ERROR PRICE:\n\n    FAILED ON: PRICE MIN >= 0 | PRICE MAX > 0 | PRICE EXACT > 0'
      res.render('home')
      return
    } else if (error.message === '400 BAD REQUEST | ERROR in URL: TAG query param should match <motor|lifestyle|mobile|work> pattern') {
      res.locals.errorURL = 'IF YOU WANNA PLAY DIRECTLY WITH THE URL QUERY PARAMS\ntag MUST MATCH ONE OF THE FOLLOWING PATTERNS\n  motor | lifestyle | mobile | work'
      res.render('home')
      return
    } else if (error.message === '400 BAD REQUEST | ERROR in URL: SORT query param should match <name|name-1|price|price-1> pattern') {
      res.locals.errorURL = 'IF YOU WANNA PLAY DIRECTLY WITH THE URL QUERY PARAMS\nsort MUST MATCH ONE OF THE FOLLOWING PATTERNS\n  name | name-1 | price | price-1'
      res.render('home')
      return
    } else if (error.message === '400 BAD REQUEST | ERROR in URL: priceMin | priceMax | priceExact query params should be a number > 0') {
      res.locals.errorURL = 'IF YOU WANNA PLAY DIRECTLY WITH THE URL QUERY PARAMS\n   priceMin | priceMax | priceExact must be a number > 0'
      res.render('home')
      return
    }
    next(error)
  }
}

export default index
