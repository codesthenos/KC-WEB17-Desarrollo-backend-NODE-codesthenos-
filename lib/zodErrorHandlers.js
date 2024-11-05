import { setupLoginLocals } from './config.js'

export const handleValidationError = (error, res, email) => {
  const errorMessage = error.errors.map(err => {
    if (!err.validation) err.validation = 'password'
    return `
      ERROR in ${err.validation}
            message: ${err.message}
    `
  }).join('')
  setupLoginLocals(res, { error: errorMessage, email })
  res.render('login')
}
