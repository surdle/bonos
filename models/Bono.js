import mongoose from 'mongoose'

export const bonoSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

bonoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Bono = mongoose.model('Bono', bonoSchema)

// Bono.find({}).then(result => {
//   result.forEach(bono => {
//     console.log(bono)
//   })
//   dbConnection.close()
// })

// const bono = new Bono({
//   content: 'Bono was here',
//   date: new Date(),
//   important: true
// })

// bono.save().then((result) => {
//   console.log(result)
//   dbConnection.close()
// }
// )
