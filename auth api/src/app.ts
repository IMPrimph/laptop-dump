require('dotenv').config()
import express from 'express'
import config from 'config'
import connectToDB from './utils/connectToDb'
import log from './utils/logger'

import router from './routes'

const app = express()

app.use(router)

const port = config.get('port')

app.listen(port || 3000, () => {
    log.info("Server started running")

    connectToDB()
})