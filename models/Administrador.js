import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const administradorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String
})

// Esto asegura que no se puedan crear dos administradores con el mismo correo electronico
administradorSchema.plugin(uniqueValidator)

// Definimos cómo se deben transformar los objetos de admnistrador cuando se convierten a JSON
administradorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Convertimos el _id (que es un ObjectId) a una cadena de texto
    delete returnedObject._id // Eliminamos la propiedad _id
    delete returnedObject.__v // Eliminamos la propiedad __v (usada internamente por Mongoose)
    delete returnedObject.passwordHash // Eliminamos el hash de la contraseña por seguridad
  }
})

// Creamos el modelo de Administrador utilizando el esquema definido anteriormente
export const Administrador = mongoose.model('Administrador', administradorSchema)
