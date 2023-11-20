import mongoose from 'mongoose'

export const connectionString = process.env.MONGO_DB_URI || 'mongodb://localhost/bono-list'

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(connectionString)
    console.log('Connected to database')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

process.on('uncaughtException', (err) => {
  console.error(err.message)
  mongoose.connection.close()
  process.exit(1)
})
