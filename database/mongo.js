import mongoose from 'mongoose'

// Definimos la cadena de conexión a la base de datos MongoDB
export const connectionString = process.env.MONGO_DB_URI || 'mongodb://localhost/bono-list'

// Definimos una función asíncrona para conectarnos a la base de datos
export const connectToDatabase = async () => {
  try {
    // Intentamos conectarnos a la base de datos
    await mongoose.connect(connectionString)
    // Si la conexión es exitosa, imprimimos un mensaje en la consola
    console.log('Connected to database')
  } catch (err) {
    // Si ocurre un error durante la conexión, imprimimos el mensaje de error en la consola
    console.error(err.message)
    // Y terminamos el proceso con un código de salida 1 (que indica que ocurrió un error)
    process.exit(1)
  }
}

// Escuchamos el evento 'uncaughtException'
// Este evento se emite cuando ocurre una excepción que no fue capturada
process.on('uncaughtException', (err) => {
  console.error(err.message)
  // Desconectamos de la base de datos
  mongoose.disconnect()
  process.exit(1)
})
