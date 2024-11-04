import createError from 'http-errors'
import { Product } from '../models/Product.js'

export const getCreateProduct = (req, res, next) => {
  res.locals.title = 'CREATE PRODUCT NODEPOP'
  res.locals.headerLinkHref = '/'
  res.locals.headerLinkText = 'HOME'
  res.locals.error = ''
  res.render('create-product')
}

export const postNewProduct = (req, res, next) => {
  console.log('SAVE PRODUCT IN DATABASE')
}

export const deleteProduct = async (req, res, next) => {
  try {
    // get the product._id from the route params
    const productId = req.params.id
    // get the user._id from the session
    const userId = req.session.userId
    // get the product info from the database
    const product = await Product.findById(productId)
    // check if the userId from the session is the owner of the product
    if (userId !== product.owner.toString()) {
      console.warn(`WARNING | user with id ${userId} is trying to delete a product from other owner`)
      next(createError(401))
      return
    }
    // check if product exists
    if (!product) {
      console.warn(`WARNING | product with id ${productId} is not found`)
      next(createError(404))
      return
    }
    // after all checks finally delete the product
    await Product.deleteOne({ _id: productId })
    console.log('SUCCESSFULLY DELETED PRODUCT: ' + productId)
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}
