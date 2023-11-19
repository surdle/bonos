import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './mongo.js'
import { Bono } from './models/Bono.js'
import { notFound } from './middleware/notFound.js'
import { handleErrors } from './middleware/handleErrors.js'

const app = express()
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
}
)

app.get('/api/bonos', (req, res) => {
  connectToDatabase()
  Bono.find({}).then(result => {
    res.json(result)
  })
}

)

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

app.delete('/api/bonos/:id', (req, res, next) => {
  const id = req.params.id

  Bono.findOneAndDelete({ _id: id }).then(result => {
    res.status(204).end()
  }).catch(err => {
    next(err)
  })
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

app.post('/api/bonos', (req, res) => {
  const bono = req.body

  if (!bono || !bono.content) {
    return res.status(400).json({
      error: 'content missing'
    }
    )
  }

  const newBono = new Bono({
    content: bono.content,
    important: bono.important || false,
    date: new Date()
  }
  )

  newBono.save().then((result) => {
    console.log(result)
    res.status(201).json(newBono)
  }
  )
}
)

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}

)
