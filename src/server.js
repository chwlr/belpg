const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = new express()


app.disable('x-powered-by')
app.set('host', process.env.APP_HOST || '127.0.0.1')
app.set('port', process.env.APP_PORT || 3000)
app.set('app_url', `http://${app.get('host')}:${app.get('port')}`)


//MIDDLEWARE
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}))
app.use(express.static('public'))

//VIEW ENGINE
app.set('view engine', 'ejs')







app.use(require('./router'))


module.exports = app