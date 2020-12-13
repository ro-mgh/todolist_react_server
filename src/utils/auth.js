import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const userName = req.body.name
  const newEmail = req.body.email
  const passw = req.body.password

  if (!newEmail || !passw || !userName) {
    return res
      .status(400)
      .send({ emessage: 'No data typed', body: req })
      .end()
  }

  try {
    const newUser = await User.create({
      email: newEmail,
      password: passw,
      userName: userName
    })
    const token = newToken(newUser)
    res.status(200).send({ body: newUser._id, token: token })
  } catch (err) {
    return res
      .status(400)
      .send({ emessage: 'Error occured while creating new user', error: err })
      .end()
  }
}

export const signin = async (req, res) => {
  const newEmail = req.body.email
  const passw = req.body.password

  // check email and passw are in the req
  if (!newEmail || !passw) {
    return res
      .status(401)
      .send({ emessage: 'No password or email typed' })
      .end()
  }

  const existingUser = await User.findOne({ email: newEmail })

  // check if user exists
  if (!existingUser) {
    return res
      .status(401)
      .send({ emessage: 'No user found' })
      .end()
  }

  // check if the passw is correct
  if (!(await existingUser.checkPassword(passw))) {
    return res
      .status(401)
      .send({ emessage: 'Incorrect password' })
      .end()
  }

  try {
    const token = newToken(existingUser)
    // send new token
    return res.status(200).send({ body: existingUser._id, token: token })
  } catch (e) {
    return res
      .status(401)
      .send({ emessage: 'Error occured while creating new token', error: e })
      .end()
  }
}

export const protect = async (req, res, next) => {
  const token = req.headers.authorization

  if (!isCorrectToken(token)) {
    return res
      .status(401)
      .send({
        emessage: 'Token is not correct'
      })
      .end()
  }

  try {
    const payload = await verifyToken(token.split('Bearer ')[1])
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    req.user = user
    next()
  } catch (e) {
    return res
      .status(401)
      .send({
        emessage: 'Error occured in protect middlware',
        error: e
      })
      .end()
  }
}

const isCorrectToken = token => {
  const regexToken = new RegExp(/Bearer\s.+/)
  if (typeof token === 'string') {
    if (regexToken)
      if (regexToken.test(token)) {
        return true
      }
  }
  return false
}
