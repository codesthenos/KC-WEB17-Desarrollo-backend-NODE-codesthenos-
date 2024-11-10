// import { z } from 'zod'
// import { productSchema } from '../lib/validatorSchemas.js'
// import { handleProductValidationError } from '../lib/zodErrorHandlers.js'
import createError from 'http-errors'
import { Product } from '../models/Product.js'
import { CREATE_PRODUCT_TITLE, setLocals, UPDATE_PRODUCT_TITLE } from '../lib/config.js'

export const getCreateProduct = (req, res, next) => {
  setLocals(res, { title: CREATE_PRODUCT_TITLE })
  res.render('create-product')
}

export const postCreateProduct = async (req, res, next) => {
  // get data from form
  const { name, price, image, tags } = req.body
  try {
    // get userId from session
    const userId = req.session.userId
    // Validations with zod AL final lo hago con un middleware y no aqui
    // normalize tags to array if only one selected
    // const normalizedTags = typeof tags === 'string' ? [tags] : tags
    // productSchema.parse({ ...req.body, tags: normalizedTags })
    // create and store a new Product
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      image,
      tags,
      owner: userId
    })
    // save the product in the MongoDB
    await newProduct.save()
    console.log('SUCCESSFULLY CREATED PRODUCT: ' + newProduct)
    res.redirect('/')
  } catch (error) {
    /* if (error instanceof z.ZodError) {
      handleProductValidationError(CREATE_PRODUCT_TITLE, error, res, name, price, image, tags)
    } else */ if (error.errorResponse.code === 11000) {
      setLocals(res, { title: CREATE_PRODUCT_TITLE, productName: name, productPrice: price, productImage: image, productTags: tags, error: '    NAME cant be repeated' })
      res.render('create-product')
    } else {
      next(error)
    }
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    // get the product._id from the route params
    const productId = req.params.id
    // get the user._id from the session
    const userId = req.session.userId
    // get the product info from the database
    const product = await Product.findById(productId)
    // check if product exists
    if (!product) {
      console.warn(`WARNING | product with id ${productId} is not found`)
      next(createError(404))
      return
    }
    // check if the userId from the session is the owner of the product
    if (userId !== product.owner.toString()) {
      console.warn(`WARNING | user with id ${userId} is trying to delete a product from other owner`)
      next(createError(401))
      return
    }
    // after all checks finally delete the product
    await Product.deleteOne({ _id: productId })
    console.log('SUCCESSFULLY DELETED PRODUCT: ' + product)
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

export const getUpdateProduct = async (req, res, next) => {
  try {
    // get productID from route params
    const { id } = req.params
    // get userId from session
    const userId = req.session.userId
    // store in a variable the user from the MongoDB
    const { name, price, image, tags, owner } = await Product.findById(id)
    // check if there is an existen product with the id from the route param
    if (!name) {
      console.warn(`WARNING | product with id ${id} is not found`)
      next(createError(404))
      return
    }
    // check if the userId from the session is the owner of the product
    if (userId !== owner.toString()) {
      console.warn(`WARNING | user with id ${userId} is trying to update a product from other owner`)
      next(createError(401))
      return
    }
    // Set locals using the user data
    setLocals(res, { title: UPDATE_PRODUCT_TITLE, productName: name, productPrice: price, productImage: image, productTags: tags })
    res.render('create-product')
  } catch (error) {
    next(error)
  }
}

export const postUpdateProduct = async (req, res, next) => {
  // get form data
  const { name, price, image, tags } = req.body
  // get productId from route params
  const { id } = req.params
  try {
    // get userId from session
    const userId = req.session.userId
    // get the product info from the database
    const product = await Product.findById(id)
    // check if the product exists
    if (!product) {
      console.warn(`WARNING | product with id ${id} is not found`)
      next(createError(404))
      return
    }
    // check if the userId from the session is the owner of the product
    if (userId !== product.owner.toString()) {
      console.warn(`WARNING | user with id ${userId} is trying to update a product from other owner`)
      next(createError(401))
      return
    }
    // Validations with zod
    // normalize tags to array if only one selected
    // const normalizedTags = typeof tags === 'string' ? [tags] : tags
    // productSchema.parse({ ...req.body, tags: normalizedTags })
    // after all checks and the validation update the product in the MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name,
      price: parseFloat(price),
      image,
      tags,
      owner: userId
    }, { new: true, runValidators: true })
    console.log('SUCCESSFULLY UPDATED PRODUCT: ' + updatedProduct)
    res.redirect('/')
  } catch (error) {
    /* if (error instanceof z.ZodError) {
      handleProductValidationError(UPDATE_PRODUCT_TITLE, error, res, name, price, image, tags)
    } else */ if (error.errorResponse.code === 11000) {
      setLocals(res, { title: UPDATE_PRODUCT_TITLE, productName: name, productPrice: price, productImage: image, productTags: tags, error: '    NAME cant be repeated' })
      res.render('create-product')
    } else {
      next(error)
    }
  }
}
