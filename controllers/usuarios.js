import express from 'express'
import bycrypt from 'bcrypt'
import { connectToDatabase } from '../database/mongo.js'
import { Administrador } from '../models/Administrador.js'
import { Encargado } from '../models/Encargado.js'
import { Monitor } from '../models/Monitor.js'

export const usuariosRouter = express.Router()

usuariosRouter.get('/', async (req, res) => {
  try {
    await connectToDatabase()
    const [administradores, encargados, monitores] = await Promise.all([
      Administrador.find({}),
      Encargado.find({}),
      Monitor.find({})
    ])
    const users = [...administradores, ...encargados, ...monitores]
    res.json(users)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

usuariosRouter.post('/', async (req, res) => {
  try {
    await connectToDatabase()
    const body = req.body

    if (!body.password || body.password.length < 3) {
      return res.status(400).json({
        error: 'password missing or too short'
      })
    }

    const existingUser = await Promise.all([
      Administrador.findOne({ email: body.email }),
      Encargado.findOne({ email: body.email }),
      Monitor.findOne({ email: body.email })
    ])

    if (existingUser.some(user => user !== null)) {
      return res.status(400).json({
        error: 'Email already exists'
      })
    }

    const saltRounds = 10
    const passwordHash = await bycrypt.hash(body.password, saltRounds)

    let user
    switch (body.role) {
      case 'administrador':
        user = new Administrador({
          email: body.email,
          name: body.name,
          passwordHash
        })
        break
      case 'encargado':
        user = new Encargado({
          email: body.email,
          name: body.name,
          passwordHash
        })
        break
      case 'monitor':
        user = new Monitor({
          email: body.email,
          name: body.name,
          passwordHash
        })
        break
      default:
        return res.status(400).json({
          error: 'Invalid role'
        })
    }

    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
