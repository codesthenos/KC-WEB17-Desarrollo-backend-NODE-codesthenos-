import { APP_TITLE } from '../lib/config.js'

const index = (req, res, next) => {
  res.locals.title = APP_TITLE
  res.render('home')
}

export default index
