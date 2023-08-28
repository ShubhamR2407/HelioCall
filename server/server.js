const express = require('express')
const colors = require('colors')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const connectDB = require('./config/connectDB')
const authRoute = require('./routes/userRoutes')
const meetRoute = require('./routes/meetRoutes')
const { errorHandler } = require('./middlewares/error')
const { socketServer } = require('./socketIo')

// Connection to MongoDb atlas
connectDB()

const app = express()
const server = app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`.yellow.underline)
})

//Checking
app.get("/", (req, res) => {
  res.json("hello");
});

//connection Socket
socketServer(server)

//Enabling cookieParser
app.use(cookieParser())

//Enabling cors
app.use(
  cors({
    origin: 'https://heliocall.onrender.com',
    credentials: true,
  })
)

// middleware for x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//Error handler middleware
app.use(errorHandler)

//middleware for Json parsing
app.use(express.json())

app.use('/api/users', authRoute)
app.use('/api/', meetRoute)
