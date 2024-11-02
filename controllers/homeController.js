import { APP_TITLE } from '../lib/config.js'
import { Product } from '../models/Product.js'

const index = async (req, res, next) => {
  res.locals.title = APP_TITLE
  res.locals.products = await Product.find()
  res.render('home')
}

export default index
