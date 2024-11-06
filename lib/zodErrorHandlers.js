import { setLocals } from './config.js'

export const handleLoginValidationError = (title, error, res, email) => {
  const errorMessage = error.errors.map(err => {
    if (!err.validation) err.validation = 'password'
    return `
      ERROR in ${err.validation}
            message: ${err.message}
    `
  }).join('')
  setLocals(res, { email, title, error: errorMessage })
  res.render('login-register')
}

export const handleProductValidationError = (title, error, res, productName, productPrice, productImage, productTags) => {
  const errorMessage = error.errors.map(err =>
    `
      message: ${err.message}
    `).join('')
  setLocals(res, { productName, productPrice, productImage, productTags, title, error: errorMessage })
  res.render('create-product')
}
