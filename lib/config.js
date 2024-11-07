export const APP_TITLE = 'CODESTHENOS-NODEPOP'

export const SESSION_COOKIE_NAME = 'nodepop-session'

const dayInSeconds = 1000 * 60 * 60 * 24
export const SESSION_COOKIE_DURATION = dayInSeconds * 3

export const LOGIN_TITLE = 'LOGIN CODESTHENOS-NODEPOP'

export const CREATE_PRODUCT_TITLE = 'CREATE PRODUCT NODEPOP'

export const REGISTER_TITLE = 'REGISTER CODESTHENOS-NODEPOP'

export const UPDATE_PRODUCT_TITLE = 'UPDATE PRODUCT NODEPOP'

export const PRODUCTS_PER_PAGE = 3

export const CURRENT_PAGE = 0

export const setLocals = (res, options = {}) => {
  res.locals.title = options.title || ''
  res.locals.headerLinkHref = options.headerLinkHref || '/'
  res.locals.headerLinkText = options.headerLinkText || 'HOME'
  res.locals.error = options.error || ''
  res.locals.email = options.email || ''
  res.locals.productName = options.productName || ''
  res.locals.productPrice = options.productPrice || ''
  res.locals.productImage = options.productImage || ''
  res.locals.productTags = options.productTags || []
}

export const normalizePriceFilter = (priceString) => {
  // regexp to match the pattern
  const validPattern = /^(\d+(-\d+)?$|^-\d+)$|^\d+-$/
  // throw error if doesnt match
  if (!validPattern.test(priceString)) throw new Error('ERROR in URL: The price query param should match <number>-<number> pattern')
  // return the normalized price filter
  if (priceString.includes('-')) {
    const priceList = priceString.split('-')

    if (priceList[0] === '') return { $lte: +priceList[1] }

    if (priceList[1] === '') return { $gte: +priceList[0] }

    return { $gte: +priceList[0], $lte: +priceList[1] }
  }
  return +priceString
}

export const normalizePriceLocal = (priceString) => {
  // regexp to match the pattern
  const validPattern = /^(\d+(-\d+)?$|^-\d+)$|^\d+-$/
  // throw error if doesnt match
  if (!validPattern.test(priceString)) throw new Error('ERROR in URL: The price query param should match <number>-<number> pattern')
  // return normalized price local
  if (priceString.includes('-')) {
    const priceList = priceString.split('-')

    if (priceList[0] === '') return `Products price < ${priceList[1]}€`

    if (priceList[1] === '') return `Products price > ${priceList[0]}€`

    return `${priceList[0]}€ > Product price < ${priceList[1]}€`
  }
  return `Product price = ${+priceString}€`
}

export const normalizeURL = (queryParams = {}) => {
  const redirectQuery = {}
  if (queryParams.skip >= 0) redirectQuery.skip = `skip=${queryParams.skip}`
  if (queryParams.limit) redirectQuery.limit = `limit=${queryParams.limit}`
  if (queryParams.name) redirectQuery.name = `name=${queryParams.name}`
  if (queryParams.price) redirectQuery.price = `price=${queryParams.price}`
  if (queryParams.tag) redirectQuery.tag = `tag=${queryParams.tag}`
  if (queryParams.sort) redirectQuery.sort = `sort=${queryParams.sort}`
  if (Object.values(redirectQuery).length > 0) return Object.values(redirectQuery).join('&')
}
