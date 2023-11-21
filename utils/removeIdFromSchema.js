export const removeIdFromSchema = {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Convertimos el _id (que es un ObjectId) a una cadena de texto
    delete returnedObject._id // Eliminamos la propiedad _id
    delete returnedObject.__v // Eliminamos la propiedad __v (usada internamente por Mongoose)
  }
}
