export const APP_TITLE = 'CODESTHENOS-NODEPOP'

export const SESSION_COOKIE_NAME = 'nodepop-session'

const dayInSeconds = 1000 * 60 * 60 * 24
export const SESSION_COOKIE_DURATION = dayInSeconds * 3

export const LOGIN_TITLE = 'LOGIN CODESTHENOS-NODEPOP'

export const CREATE_PRODUCT_TITLE = 'CREATE PRODUCT NODEPOP'

export const setLocals = (res, options = {}) => {
  res.locals.title = options.title || ''
  res.locals.headerLinkHref = options.headerLinkHref || '/'
  res.locals.headerLinkText = options.headerLinkText || 'HOME'
  res.locals.error = options.error || ''
  res.locals.email = options.email || ''
  res.locals.productName = options.productName || ''
  res.locals.productPrice = options.productPrice || ''
  res.locals.productImage = options.productImage || ''
}
