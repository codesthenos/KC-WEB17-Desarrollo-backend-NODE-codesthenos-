export const APP_TITLE = 'CODESTHENOS-NODEPOP'

export const SESSION_COOKIE_NAME = 'nodepop-session'

const dayInSeconds = 1000 * 60 * 60 * 24
export const SESSION_COOKIE_DURATION = dayInSeconds * 3

const LOGIN_TITLE = 'LOGIN CODESTHENOS-NODEPOP'
export const setupLoginLocals = (res, options = {}) => {
  res.locals.title = options.title || LOGIN_TITLE
  res.locals.headerLinkHref = options.headerLinkHref || '/'
  res.locals.headerLinkText = options.headerLinkText || 'HOME'
  res.locals.error = options.error || ''
  res.locals.email = options.email || ''
}
