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

export const deleteProduct = (req, res, next) => {
  console.log('DELETE PRODUCT')
}
