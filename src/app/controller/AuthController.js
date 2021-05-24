'use strict';
 
const models = require('../models');
const jwt = require('jsonwebtoken')

const maxAge = 1 * 24 * 60 * 60


//handle errors
const handleErros = (err) => {
  console.log(err.message, err.code)
  let error = {nama: '', email: '', password: ''}

  //login error
  if(err.message === 'incorrect email'){
    error.email = 'email not registered'
  }
  if(err.message === 'incorrect password'){
    error.password = 'password not registered'
  }

  //validator error
  if(err.message.includes('Validation error')){
    err.errors.map(test => error[test.path] = test.message )
  }
  return error
}

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_KEY, {
    expiresIn: maxAge
  })
}

const registerUser = async (req, res) => {
  const { nama, email, password } = req.body

  try {
    const user = await models.users.create({
      nama,
      email,
      password
    })
    const token = createToken(user.id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, path: "/"})
    res.status(201).json({ user })
  } catch (err) {
    const errors = handleErros(err)
    return res.status(400).json({ errors })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  
  try {
    const user = await models.users.login(email, password)
    const token = createToken(user.id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, path: "/"})
    res.status(200).json({
      token: token, auth: true
    })

  } catch (err) {
    const errors = handleErros(err)
    return res.status(400).json({
      error: errors
    })
  }
}

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1})
  return res.status(200).json('Succesful logout')
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser
}