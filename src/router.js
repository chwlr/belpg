const express = require('express')
const router = express.Router()
const {requireAuth, currentUser} = require('./app/middleware/authMiddleware')
const multer = require('multer')


//MULTER SETUP
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true)
  }else {
    cb(null, false)
  }
}

//view routes
router.get('/', (req, res) => {
  res.render('home')
})

router.get('/login', (req, res) => {
  res.render('login')
})


router.get('/dashboard', requireAuth,(req, res) => res.render('dashboard'))



//auth--routes
router.post('/user/register', requireAuth, require('./app/controller/AuthController').registerUser)
router.post('/user/login', require('./app/controller/AuthController').loginUser)
router.get('/user/logout', require('./app/controller/AuthController').logoutUser)
router.get('/user/current', currentUser)

//articles--routes
router.post('/artikel', requireAuth, multer({ storage: fileStorage, fileFilter: fileFilter }).single('foto'), require('./app/controller/articles').createArticle)
router.get('/artikel', requireAuth, require('./app/controller/articles').indexArticle)
router.delete('/artikel/:id', requireAuth, require('./app/controller/articles').deleteArticle)
router.put('/artikel/:id', requireAuth, multer({ storage: fileStorage, fileFilter: fileFilter }).single('foto'), require('./app/controller/articles').updateArticle)
router.get('/artikel/:id', requireAuth,  require('./app/controller/articles').showArticle)

//API
router.get('/api/artikel', require('./app/controller/articles').indexArticle)

module.exports = router