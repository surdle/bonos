import express from 'express'
import { User } from '../models/User.js'
import bycrypt from 'bcrypt'
import { disconnect } from 'mongoose'
import { connectToDatabase } from '../database/mongo.js'

export const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
  try {
    await connectToDatabase()
    const users = await User
      .find({}).populate('bonos', { content: 1, date: 1 })
    disconnect()
    res.json(users)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

usersRouter.post('/', async (req, res) => {
  try {
    await connectToDatabase()
    const body = req.body

    if (!body.password || body.password.length < 3) {
      return res.status(400).json({
        error: 'password missing or too short'
      })
    }

    const saltRounds = 10
    const passwordHash = await bycrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
