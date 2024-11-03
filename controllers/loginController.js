import { LOGIN_TITLE } from '../lib/config.js'

const index = async (req, res, next) => {
  res.locals.title = LOGIN_TITLE
  res.locals.headerLinkHref = '/'
  res.locals.headerLinkText = 'HOME'
  res.render('login')
}

export default index
