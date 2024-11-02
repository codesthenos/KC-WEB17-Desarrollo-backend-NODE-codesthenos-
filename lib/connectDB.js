import mongoose from 'mongoose'
import { debug } from './debug.js'
import { MONGO_URI } from './secret.js'

mongoose.connection.on('error', error => debug('ERROR IN THE CONEXION WITH THE DATABASE', error))

export const connectDB = () => mongoose.connect(MONGO_URI).then(mongoose => mongoose.connection)
