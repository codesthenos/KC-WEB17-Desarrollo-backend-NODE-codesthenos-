const index = (req, res, next) => {
  // regenerate deletes the actual session and creates a new one (rq.session object is resotred to default values)
  req.session.regenerate(error => {
    if (error) return next(error)
    res.redirect('/')
  })
}
export default index
