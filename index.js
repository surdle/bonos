import express from 'express'
import cors from 'cors'
import { notFound } from './middleware/notFound.js'
import { handleErrors } from './middleware/handleErrors.js'
import { usersRouter } from './controllers/users.js'
import { loginRouter } from './controllers/login.js'
import { bonosRouter } from './controllers/bonos.js'

const app = express()

// Usamos el middleware CORS para permitir solicitudes de origen cruzado
app.use(cors())
// Usamos el middleware de Express para analizar el cuerpo de las solicitudes HTTP como JSON
app.use(express.json())

// Definimos las rutas para nuestra API
app.use('/api/bonos', bonosRouter) // Rutas para los bonos
app.use('/api/users', usersRouter) // Rutas para los usuarios
app.use('/api/login', loginRouter) // Rutas para la autenticación

// Usamos el middleware personalizado para manejar las rutas no encontradas y los errores
app.use(notFound)
app.use(handleErrors)

// Definimos el puerto en el que se ejecutará nuestra aplicación
const PORT = process.env.PORT || 3001

// Iniciamos nuestra aplicación en el puerto definido
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}/api/`)
})
