import createHttpError from 'http-errors'

export const APP_TITLE = 'CODESTHENOS-NODEPOP'

export const SESSION_COOKIE_NAME = 'nodepop-session'

const dayInSeconds = 1000 * 60 * 60 * 24
export const SESSION_COOKIE_DURATION = dayInSeconds * 3

export const LOGIN_TITLE = 'LOGIN CODESTHENOS-NODEPOP'

export const CREATE_PRODUCT_TITLE = 'CREATE PRODUCT NODEPOP'

export const REGISTER_TITLE = 'REGISTER CODESTHENOS-NODEPOP'

export const UPDATE_PRODUCT_TITLE = 'UPDATE PRODUCT NODEPOP'

export const PRODUCTS_PER_PAGE = 2

export const CURRENT_PAGE = 0

export const setLocals = (res, options = {}) => {
  // common
  res.locals.title = options.title || ''
  res.locals.headerLinkHref = options.headerLinkHref || '/'
  res.locals.headerLinkText = options.headerLinkText || 'HOME'
  res.locals.error = options.error || ''
  res.locals.errorURL = options.errorURL || ''
  // user
  res.locals.email = options.email || ''
  // product
  res.locals.productName = options.productName || ''
  res.locals.productPrice = options.productPrice || ''
  res.locals.productImage = options.productImage || ''
  res.locals.productTags = options.productTags || []
  // home
  // query params
  res.locals.skip = options.skip || ''
  res.locals.limit = options.limit || ''
  res.locals.name = options.name || ''
  res.locals.tag = options.tag || ''
  res.locals.sort = options.sort || ''
  // price query params
  res.locals.priceMin = options.priceMin || ''
  res.locals.priceMax = options.priceMax || ''
  res.locals.priceExact = options.priceExact || ''
  res.locals.price = options.price || ''
  // price view
  res.locals.priceView = options.priceView || ''
  // pagination nav locals
  res.locals.nextPage = options.nextPage || 0
  res.locals.hrefNextPage = options.hrefNextPage || ''
  res.locals.previousPage = options.previousPage || 0
  res.locals.hrefPreviousPage = options.hrefPreviousPage || ''
  res.locals.hrefPaginate = options.hrefPaginate || ''
  res.locals.hrefShowAll = options.hrefShowAll || ''
  // sorting name nav locals
  res.locals.hrefNameSortAtoZ = options.hrefNameSortAtoZ || ''
  res.locals.hrefNameSortZtoA = options.hrefNameSortZtoA || ''
  // sorting price nav locals
  res.locals.hrefPriceSortASC = options.hrefPriceSortASC || ''
  res.locals.hrefPriceSortDES = options.hrefPriceSortDES || ''
  // unsort nav local
  res.locals.hrefUnsort = options.hrefUnsort || ''
  // locals for UNSET filters
  res.locals.hrefNameUnsetFilter = options.hrefNameUnsetFilter || ''
  res.locals.hrefPriceMinMaxUnsetFilter = options.hrefPriceMinMaxUnsetFilter || ''
  res.locals.hrefPriceExactUnsetFilter = options.hrefPriceExactUnsetFilter || ''
  res.locals.hrefTagUnsetFilter = options.hrefTagUnsetFilter || ''
  // products list
  res.locals.productsLength = options.productsLength || 0
  res.locals.products = options.products || []
}

export const validateQueryPrice = (priceString) => {
  // regexp to match the pattern
  const validPattern = /^(\d+(-\d+)?$|^-\d+)$|^\d+-$/
  // throw error if doesnt match
  if (!validPattern.test(priceString)) throw createHttpError(400, '400 BAD REQUEST | ERROR in URL: PRICE query param should match <number>-<number> pattern')
  // return normalized price local
  return priceString
}

export const normalizePriceMongo = (priceString) => {
  // return the normalized price filter
  if (priceString.includes('-')) {
    const priceList = priceString.split('-')

    if (priceList[0] === '') return { $lte: +priceList[1] }

    if (priceList[1] === '') return { $gte: +priceList[0] }

    return { $gte: +priceList[0], $lte: +priceList[1] }
  }
  return +priceString
}

export const normalizedPrice = ({ priceMin, priceMax, priceExact }) => {
  if ((priceMin && +priceMin < 0) || (priceMax && +priceMax <= 0) || (priceExact && +priceExact <= 0)) {
    throw createHttpError(400, '400 BAD REQUEST | ERROR PRICE: FAILED ON: PRICE MIN >= 0 | PRICE MAX > 0 | PRICE EXACT > 0')
  }
  if ((priceMin && isNaN(priceMin)) || (priceMax && isNaN(priceMax)) || (priceExact && isNaN(priceExact))) {
    throw createHttpError(400, '400 BAD REQUEST | ERROR in URL: priceMin | priceMax | priceExact query params should be a number > 0')
  }
  if (priceMin >= 0 && priceMax > 0) return `${priceMin}-${priceMax}`
  if (priceMin && !priceMax) return `${priceMin}-`
  if (!priceMin && priceMax) return `-${priceMax}`
  if (priceExact) return `${priceExact}`
  return ''
}

export const validateQuerySort = (sortString) => {
  // regexp to validate the query param
  const validPattern = /^(name|name-1|price|price-1)$/
  if (!validPattern.test(sortString)) throw createHttpError(400, '400 BAD REQUEST | ERROR in URL: SORT query param should match <name|name-1|price|price-1> pattern')
  // return normalized sort
  return sortString
}
export const normalizeSortMongo = (sortString) => {
  // return normalized sort
  if (sortString === 'name') return { name: 1 }
  if (sortString === 'name-1') return { name: -1 }
  if (sortString === 'price') return { price: 1 }
  if (sortString === 'price-1') return { price: -1 }
}

export const validateQueryTag = (tagString) => {
  const validPattern = /^(motor|mobile|lifestyle|work)$/i
  if (!validPattern.test(tagString)) throw createHttpError(400, '400 BAD REQUEST | ERROR in URL: TAG query param should match <motor|lifestyle|mobile|work> pattern')
  return tagString.toLowerCase()
}

export const normalizeURL = (queryParams = {}) => {
  const redirectQuery = {}
  if (queryParams.skip >= 0) redirectQuery.skip = `skip=${queryParams.skip}`
  if (queryParams.limit) redirectQuery.limit = `limit=${queryParams.limit}`
  if (queryParams.name) redirectQuery.name = `name=${queryParams.name}`
  if (queryParams.price) redirectQuery.price = `price=${queryParams.price}`
  if (queryParams.tag) redirectQuery.tag = `tag=${queryParams.tag}`
  if (queryParams.sort) redirectQuery.sort = `sort=${queryParams.sort}`
  if (queryParams.priceMin) redirectQuery.priceMin = `priceMin=${queryParams.priceMin}`
  if (queryParams.priceMax) redirectQuery.priceMax = `priceMax=${queryParams.priceMax}`
  if (queryParams.priceExact) redirectQuery.priceExact = `priceExact=${queryParams.priceExact}`
  if (Object.values(redirectQuery).length > 0) return `/?${Object.values(redirectQuery).join('&')}`
  return '/'
}
