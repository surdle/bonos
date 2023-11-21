import express from 'express'
import { connectToDatabase } from '../database/mongo.js'
import { Bono } from '../models/Bono.js'
import { listaEstudiantes } from '../database/lista-estudiantes.js'
import { userExtractor } from '../middleware/userExtractor.js'

export const bonosAsignadosRouter = express.Router()

bonosAsignadosRouter.get('/today', async (req, res) => {
  try {
    await connectToDatabase()
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    const bonos = await Bono.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
    const totalBonos = bonos.length
    const remainingBonos = 80 - totalBonos
    res.json({
      bonos,
      totalBonos,
      remainingBonos
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

bonosAsignadosRouter.get('/', userExtractor, async (req, res) => {
  connectToDatabase()
  const bonos = await Bono.find({})
  res.json(bonos)
})

bonosAsignadosRouter.get('/:id', userExtractor, (req, res, next) => {
  const id = req.params.id
  Bono.findById(id).then(bono => {
    if (bono) {
      res.json(bono)
    } else {
      res.status(404).end()
    }
  }).catch(next)
})

bonosAsignadosRouter.delete('/:id', async (req, res, next) => {
  try {
    await connectToDatabase()
    const id = req.params.id
    await Bono.findOneAndDelete({ _id: id })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

bonosAsignadosRouter.post('/', async (req, res, next) => {
  try {
    await connectToDatabase()
    const { codigoEstudiante } = req.body

    const estudiante = listaEstudiantes.find(estudiante => estudiante.codigoEstudiante === codigoEstudiante)
    if (!estudiante) {
      return res.status(400).json({
        error: 'code does not exist'
      })
    }

    if (!req.body || !codigoEstudiante) {
      return res.status(400).json({
        error: 'content missing'
      })
    }

    const currentHour = new Date().getHours()
    if (currentHour < 8 || currentHour > 11) {
      return res.status(400).json({
        error: 'Bono can only be assigned between 8 AM and 11 AM'
      })
    }

    if (!estudiante.beneficiario && currentHour < 10) {
      return res.status(400).json({
        error: 'Non-beneficiary students can only request bono between 10 AM and 11 AM'
      })
    }

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const existingBono = await Bono.findOne({
      codigoEstudiante,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })

    if (existingBono) {
      return res.status(400).json({
        error: 'Bono already assigned today'
      })
    }

    const newBonoAsignado = new Bono({
      codigoEstudiante,
      date: new Date()
    })

    const savedBono = await newBonoAsignado.save()

    res.status(201).json(savedBono)
  } catch (error) {
    next(error)
  }
})
