import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'

import connectDB from './db/connect.js'
import authRouter from './routes/authRouter.js'
import watchlistRouter from './routes/watchlistRouter.js'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'

//*________________________________________________

dotenv.config()
export const token_secret = process.env.TOKEN_SECRET
export const global_env = process.env.GLOBAL_ENV
const app = express()
const PORT = process.env.PORT || 5000

//*________________________________________________

app.get('/', (req, res) => {
    res.send('MOVIE API')
})

//*________________________________________________

app.set('trust proxy', 1)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(morgan('dev'))

app.use('/api/auth', authRouter)
app.use('/api/watchlist', watchlistRouter)

app.use(errorHandler)
app.use(notFound)

//*________________________________________________

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(PORT, () =>
        console.log(`Server is listening on: http://localhost:${PORT}`)
      );
    } catch (error) {
      console.log(error)
    }
  };

start();

//*________________________________________________