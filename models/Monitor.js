import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const monitorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String
})

// Esto asegura que no se puedan crear dos monitores con el mismo correo electronico
monitorSchema.plugin(uniqueValidator)

// Definimos cómo se deben transformar los objetos de admnistrador cuando se convierten a JSON
monitorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Convertimos el _id (que es un ObjectId) a una cadena de texto
    delete returnedObject._id // Eliminamos la propiedad _id
    delete returnedObject.__v // Eliminamos la propiedad __v (usada internamente por Mongoose)
    delete returnedObject.passwordHash // Eliminamos el hash de la contraseña por seguridad
  }
})

// Creamos el modelo de monitor utilizando el esquema definido anteriormente
export const Monitor = mongoose.model('monitor', monitorSchema)
