import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

// Users Mongo Collection's Schema created with mongoose
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String
}, { timestamps: true })

// Schema static method to hash the pasword
userSchema.statics.hashPassword = rawPassword => bcrypt.hash(rawPassword, 10)

// Instance method to compare given rawPassword with instance.password
userSchema.methods.comparePassword = function (rawPassword) {
  return bcrypt.compare(rawPassword, this.password)
}

// Mongo Collection 'Users'
export const User = model('User', userSchema)
