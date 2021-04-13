/* eslint-disable no-unused-vars */
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
//const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to: ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        logger.info('Connected to the DB')
    })
    .catch((error) => {
        logger.error('Error connecting to mongoDB: ', error.message)
    }
    )

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app