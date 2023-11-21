import express from 'express'
import bcrypt from 'bcrypt'
import { connectToDatabase } from '../database/mongo.js'
import jwt from 'jsonwebtoken'
import { Administrador } from '../models/Administrador.js'
import { Encargado } from '../models/Encargado.js'
import { Monitor } from '../models/Monitor.js'

export const ingresoRouter = express.Router()

ingresoRouter.post('/', async (req, res) => {
  try {
    connectToDatabase()
    const { body } = req
    const { email, password } = body

    let user = null
    let userRol = ''

    const admin = await Administrador.findOne({ email })
    const encargado = await Encargado.findOne({ email })
    const monitor = await Monitor.findOne({ email })

    if (admin) {
      user = admin
      userRol = 'admin'
    } else if (encargado) {
      user = encargado
      userRol = 'encargado'
    } else if (monitor) {
      user = monitor
      userRol = 'monitor'
    } else {
      return res.status(401).json({
        error: 'invalid email or password'
      })
    }

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
      id: user._id,
      role: userRol
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60 * 60 }
    )

    res.send({
      username: user.username,
      name: user.name,
      role: userRol,
      token
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
