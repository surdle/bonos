import express from 'express'
import { connectToDatabase } from '../database/mongo.js'
import { Bono } from '../models/Bono.js'
import { userExtractor } from '../middleware/userExtractor.js'
import { User } from '../models/User.js'

export const bonosRouter = express.Router()

bonosRouter.get('/', async (req, res) => {
  console.log('get bonos')
  connectToDatabase()
  const bonos = await Bono.find({}).populate('user', { username: 1, name: 1 })
  res.json(bonos)
})

bonosRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Bono.findById(id).then(bono => {
    if (bono) {
      res.json(bono)
    } else {
      res.status(404).end()
    }
  }).catch(next)
}
)

bonosRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const id = req.params.id
  await Bono.findOneAndDelete({ _id: id })
  res.status(204).end()
})

bonosRouter.put('/:id', userExtractor, (req, res, next) => {
  const newBonoInfo = {
    content: req.body.content,
    important: req.body.important
  }

  Bono.findByIdAndUpdate(req.params.id, newBonoInfo, { new: true }).then(result => {
    res.json(result)
  }).catch(err => {
    next(err)
  })
})

bonosRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    await connectToDatabase()
    const {
      content,
      important = false
    } = req.body

    const { userId } = req
    const user = await User.findById(userId)

    if (!req.body || !content) {
      return res.status(400).json({
        error: 'content missing'
      }
      )
    }

    const newBono = new Bono({
      content,
      important,
      date: new Date(),
      user: user._id
    }
    )

    const savedBono = await newBono.save()
    user.bonos = user.bonos.concat(savedBono._id)
    await user.save()
    res.status(201).json(savedBono)
  } catch (error) {
    next(error)
  }
}

)
