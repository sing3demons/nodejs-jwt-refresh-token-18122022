const express = require('express')
require('dotenv').config()

const app = express()
const db = require('./db/db')

app.use(express.json())

const port = process.env.PORT || 3000
db.connectDB()

app.use('/', require('./routes/index'))
app.use('/api/user', require('./routes/user'))

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
