// app.js

const express = require('express')
const path = require('path')
const passport = require('passport')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(cookieParser())

app.use(passport.initialize())
require('./config/passport')(passport)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const indexRouter = require('./routes/indexRouter')
app.use('/', indexRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Localhost at PORT: ${PORT}`)
})
