import express from 'express'
import bycrypt from 'bcrypt'
import { connectToDatabase } from '../database/mongo.js'
import { Administrador } from '../models/Administrador.js'
import { Encargado } from '../models/Encargado.js'
import { Monitor } from '../models/Monitor.js'
import { userExtractor } from '../middleware/userExtractor.js'

export const usuariosRouter = express.Router()

usuariosRouter.get('/', userExtractor, async (req, res) => {
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

usuariosRouter.post('/', userExtractor, async (req, res) => {
  try {
    await connectToDatabase()
    const body = req.body
    const rol = req.userRol

    if (rol !== 'admin') {
      return res.status(401).json({
        error: 'Only admins can create users'
      })
    }

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
    res.json({
      savedUser,
      rol: body.role
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

usuariosRouter.put('/:id', userExtractor, async (req, res) => {
  try {
    await connectToDatabase()
    const { body } = req
    const { id } = req.params
    const rol = req.userRol

    if (rol !== 'admin') {
      return res.status(401).json({
        error: 'Only admins can update users'
      })
    }

    const saltRounds = 10
    const passwordHash = await bycrypt.hash(body.password, saltRounds)

    let user
    switch (body.role) {
      case 'administrador':
        user = {
          email: body.email,
          name: body.name,
          passwordHash
        }
        break
      case 'encargado':
        user = {
          email: body.email,
          name: body.name,
          passwordHash
        }
        break
      case 'monitor':
        user = {
          email: body.email,
          name: body.name,
          passwordHash
        }
        break
      default:
        return res.status(400).json({
          error: 'Invalid role'
        })
    }

    const updatedUser = await Promise.all([
      Administrador.findByIdAndUpdate(id, user, { new: true }),
      Encargado.findByIdAndUpdate(id, user, { new: true }),
      Monitor.findByIdAndUpdate(id, user, { new: true })
    ])

    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

usuariosRouter.delete('/:id', userExtractor, async (req, res) => {
  try {
    await connectToDatabase()
    const { id } = req.params
    const rol = req.userRol

    if (rol !== 'admin') {
      return res.status(401).json({
        error: 'Only admins can delete users'
      })
    }

    const deletedUser = await Promise.all([
      Administrador.findByIdAndDelete(id),
      Encargado.findByIdAndDelete(id),
      Monitor.findByIdAndDelete(id)
    ])

    res.json(deletedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
