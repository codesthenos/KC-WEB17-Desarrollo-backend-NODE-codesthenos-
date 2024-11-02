import { Schema, model } from 'mongoose'

const productSchema = new Schema({
  name: { type: String, unique: true },
  price: { type: Number, min: 0 },
  image: String,
  tags: [String],
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export const Product = model('Product', productSchema)
