import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import itemRouter from './resources/item/item.router'
import { signin, signup, protect, logout } from './utils/auth'
import cookieParser from 'cookie-parser'
import { getTasks } from './utils/getTasks'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

// protect middleware
app.use('/mytodolist', protect)

// routes
app.post('/signup', signup)
app.post('/signin', signin)
app.get('/mytodolist', getTasks)
app.use('/mytodolist/item', itemRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`TODO app on http://localhost:${config.port}/`)
    })
  } catch (e) {
    console.error(e)
  }
}
