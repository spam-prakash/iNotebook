const connectToMongo = require('./db')
const cors = require('cors')
const express = require('express')
const app = express()
app.use(express.json())
const port = 8000
connectToMongo()

// CORS Configuration
const allowedOrigins = [
  'https://inotebook-frontend-murex.vercel.app', // Deployed frontend URL
  'http://localhost:3006' // Local development
]

app.use(cors({
  origin: '*', // Allow requests from any origin (for testing)
  methods: 'GET,POST,PUT,DELETE', // Allowed methods
  credentials: true // Allow sending cookies and credentials
}))


// app.use(cors())

// Avilable Routes
app.use('/api/auth', require('./api/auth'))
app.use('/api/notes', require('./api/notes'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/hii', (req, res) => {
  res.send('hii World!')
})

app.listen(port, () => {
  console.log(`Website rendered to http://localhost:${port}`)
})
