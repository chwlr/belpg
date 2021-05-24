require('dotenv').config()

const logger = require('./src/common/logger')
const app = require('./src/server')

app.listen(app.get('port'), () => {
  logger.info({ message: `HTTP server is started at ${app.get('app_url')} in ${app.get('env')}` })
})
