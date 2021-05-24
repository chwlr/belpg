const jwt = require('jsonwebtoken')
const models = require('../models')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  if(token){
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if(err) {
        res.status(400).json({ err })
        res.redirect('/login')
      }else {
        next()
      }
    })
  }else {
    res.redirect('/login')
  }
}

const currentUser = (req, res, next) => {
  const token = req.cookies.jwt

  if(token){
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if(err) {
        res.status(400).json({ err })
      }else {
        const user = await models.users.findOne({ where: { id: decodedToken.id } })
        res.status(200).json({ user })
      }
    })
  }else {
    res.locals.user = null;
    next();
  }
}

module.exports = {requireAuth, currentUser}