import { LOGIN_TITLE, CREATE_PRODUCT_TITLE, setLocals } from './config.js'

export const handleLoginValidationError = (error, res, email) => {
  const errorMessage = error.errors.map(err => {
    if (!err.validation) err.validation = 'password'
    return `
      ERROR in ${err.validation}
            message: ${err.message}
    `
  }).join('')
  setLocals(res, { email, title: LOGIN_TITLE, error: errorMessage })
  res.render('login')
}

export const handleProductValidationError = (error, res, productName, productPrice, productImage) => {
  const errorMessage = error.errors.map(err =>
    `
      message: ${err.message}
    `).join('')
  setLocals(res, { productName, productPrice, productImage, title: CREATE_PRODUCT_TITLE, error: errorMessage })
  res.render('create-product')
}
