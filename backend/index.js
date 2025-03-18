// server.js

const connectToMongo = require('./db')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const userdb = require('./models/User')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy

// Dynamic Port for Production/Local
const port = process.env.PORT || 8000

// Connect to MongoDB
connectToMongo()


// const liveLink=process.env.REACT_APP_LIVE_LINK
// const clientID = process.env.REACT_APP_CLINTID
// const clientSecret = process.env.REACT_APP_CLINT_SECRET
const liveLink = process.env.REACT_APP_LIVE_LINK
const JWT_SECRET = process.env.JWT_SECRET
const hostLink=process.env.REACT_APP_HOSTLINK
// console.log('Host Link:', hostLink) // Debugging


const environment = process.env.NODE_ENV || 'development'; // Or however you determine environment
// console.log('Environment:', environment)
let redirectURL = process.env.REDIRECT_URL || `/auth/google/callback`
// console.log('Redirect URL:', redirectURL)

// let googleClientId;
if (environment === 'production') {
   clientID = process.env.REACT_APP_CLINTID_PRODUCTION;
   clientSecret = process.env.REACT_APP_CLINT_SECRET_PRODUCTION;
   redirectURL = `${hostLink}/auth/google/callback`
} else {
   clientID = process.env.REACT_APP_CLINTID_DEVELOPMENT;
   clientSecret = process.env.REACT_APP_CLINT_SECRET_DEVELOPMENT;
    redirectURL = `/auth/google/callback`
}


// Middleware for parsing JSON
app.use(express.json())

const corsOptions = {
  // origin: allowedOrigins, // Your frontend URL
  origin: '*', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'Access-Control-Allow-Origin'],
  credentials: true // If cookies or credentials need to be sent
}

app.use(cors(corsOptions))


app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://inotebook-frontend-murex.vercel.app')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.sendStatus(200)
})


app.use(passport.initialize()) // Initialize passport without session

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${redirectURL}`,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({ googleId: profile.id })

        if (!user) {
          user = new userdb({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            username: profile.emails[0].value.split('@')[0]
          })
          await user.save()
        }

        // Generate JWT Token
        // In your server.js or Google auth route
        const token = jwt.sign({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username || user.email.split('@')[0]
          }
        }, JWT_SECRET, {
          expiresIn: '7d'
        })
        // Attach user and token to done callback
        return done(null, { user, token })
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// Google Authentication Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // console.log('User Object from Passport:', req.user) // Debugging

    if (!req.user || !req.user.token) {
      return res.redirect(`${liveLink}/login?error=token_missing`)
    }

    // Send JWT token to frontend
    res.redirect(`${liveLink}/login-success?token=${req.user.token}`) // Change this to frontend URL
    // console.log(`Redirecting to: ${liveLink}/login-success?token=${req.user.token}`)
  }
)

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
// app.use("/api", require("./routes/username")); // Ensure this line exists


// Test Route (Optional)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Start Server
app.listen(port, () => {
  console.log(`Website rendered to http://localhost:${port}`)
})