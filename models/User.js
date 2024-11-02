import { Schema, model } from 'mongoose'

// Users Mongo Collection's Schema created with mongoose
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String
}, { timestamps: true })

// Schema static method to hash the pasword
// Instance method to compare given rawPassword with instance.password

// Mongo Collection 'Users'
export const User = model('User', userSchema)
