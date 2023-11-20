import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  bonos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bono'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

export const User = mongoose.model('User', userSchema)
