import mongoose from 'mongoose'

// Definimos el esquema para los bonos
export const bonoSchema = new mongoose.Schema({
  codigoEstudiante: String,
  date: Date
})

// Definimos cómo se deben transformar los objetos de bono cuando se convierten a JSON
bonoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Convertimos el _id (que es un ObjectId) a una cadena de texto
    delete returnedObject._id // Eliminamos la propiedad _id
    delete returnedObject.__v // Eliminamos la propiedad __v (usada internamente por Mongoose)
  }
})

// Creamos el modelo de bono utilizando el esquema definido anteriormente
export const Bono = mongoose.model('BonoAsginado', bonoSchema)
