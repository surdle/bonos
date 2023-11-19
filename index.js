import express from 'express'
import crypto from 'node:crypto'
import cors from 'cors'

const app = express()
app.use(cors())

app.use(express.json())

let bonos = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
}
)

app.get('/api/bonos', (req, res) => {
  res.json(bonos)
}
)

app.get('/api/bonos/:id', (req, res) => {
  const id = Number(req.params.id)
  const bono = bonos.find(bono => bono.id === id)

  if (bono) {
    res.json(bono)
  } else {
    res.status(404).end()
  }
}
)

app.delete('/api/bonos/:id', (req, res) => {
  const id = Number(req.params.id)
  bonos = bonos.filter(bono => bono.id !== id)

  res.status(204).end()
}
)

app.post('/api/bonos', (req, res) => {
  const bono = req.body

  if (!bono || !bono.content) {
    return res.status(400).json({
      error: 'content missing'
    }
    )
  }

  const newbono = {
    id: crypto.randomInt(1000000),
    content: bono.content,
    date: new Date().toISOString(),
    important: typeof bono.important !== 'undefined' ? bono.important : false
  }

  bonos = bonos.concat(newbono)
  res.status(201).json(newbono)
}
)

app.use((req, res) => {
  res.status(404).json({
    error: 'not found'
  }
  )
}
)

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}

)
