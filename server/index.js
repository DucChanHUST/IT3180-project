const express = require('express')
const app = express()
const cors = require('cors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const residentsRouter = require('./controllers/residents')

app.use(cors())
app.use(express.json())


app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/residents', residentsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()