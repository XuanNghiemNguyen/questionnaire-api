const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
require('express-async-errors')

//Init Express App
const app = express()
dotenv.config()
const apiPort = process.env.PORT || '3000'
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Some route
app.get('/', (req, res) => {
  res.send('Questionnaire API')
})

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/events', require('./src/routes/event.route.js'))
app.use('/makers', require('./src/routes/maker.route.js'))

//handle error
app.use(function (err, req, res, next) {
  return res.status(400).json({
    success: false,
    message: err.message || err
  })
})

// NOT FOUND API
app.use((req, res, next) => {
  res.status(404).send('NOT FOUND')
})




//connect database

const uri = `mongodb+srv://xuanghjem:1612427@questionnaire.kozea.mongodb.net/questionnaire?retryWrites=true&w=majority`
const connectDatabase = () => {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(
    uri,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    },
    (err) => {
      if (err) {
        console.log(
          'Failed to connect to mongo on startup - retrying in 2 sec',
          err
        )
        setTimeout(connectDatabase, 2000)
      } else {
        console.log('Connected to the database')
      }
    }
  )
}

//Init apiServer
app.listen(apiPort, () => {
  connectDatabase()
  console.log(`Listening at http://localhost:${apiPort}`)
})

module.exports = app
