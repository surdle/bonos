import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { connectToDatabase } from '../database/mongo.js'
import jwt from 'jsonwebtoken'

export const loginRouter = express.Router()

loginRouter.post('/', async (req, res) => {
  try {
    connectToDatabase()
    const { body } = req
    const { username, password } = body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60 }
    )

    res.send({
      username: user.username,
      name: user.name,
      token
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
