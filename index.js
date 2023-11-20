import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './mongo.js'
import { Bono } from './models/Bono.js'
import { notFound } from './middleware/notFound.js'
import { handleErrors } from './middleware/handleErrors.js'
import { usersRouter } from './controllers/users.js'
import { disconnect } from 'mongoose'
import { User } from './models/User.js'

const app = express()
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send(`<h1>Hello World!</h1>
  <style>
  html {
    color-scheme: dark;
  }
  </style>
  
  `)
}
)

// app.get('/api/bonos', (req, res) => {
//   connectToDatabase()
//   Bono.find({}).then(result => {
//     res.json(result)
//   })
// })

app.get('/api/bonos', async (req, res) => {
  connectToDatabase()
  const bonos = await Bono.find({}).populate('user', { username: 1, name: 1 })
  disconnect()
  res.json(bonos)
})

app.get('/api/bonos/:id', (req, res, next) => {
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

app.delete('/api/bonos/:id', async (req, res, next) => {
  const id = req.params.id
  await Bono.findOneAndDelete({ _id: id })
  res.status(204).end()
})

app.put('/api/bonos/:id', (req, res, next) => {
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

app.post('/api/bonos', async (req, res, next) => {
  try {
    connectToDatabase()
    const {
      content,
      important = false,
      userId
    } = req.body

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

app.use('/api/users', usersRouter)

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}

)
