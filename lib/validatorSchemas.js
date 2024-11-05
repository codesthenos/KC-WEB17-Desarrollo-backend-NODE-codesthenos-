import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string({
    required_error: 'Provide an email'
  }).email({
    required_error: 'Invalid email'
  }),
  password: z.string({
    required_error: 'Provide a password'
  }).min(6, {
    message: 'Password must be at least 6 characters'
  })
})

export const productSchema = z.object({
  name: z.string({
    required_error: 'Provide a product name'
  }),
  price: z.string().refine(value => !isNaN(parseFloat(value)), {
    message: 'Price must be a valid number'
  }).transform(value => parseFloat(value))
    .refine(value => value > 0, {
      message: 'Price must be greater than 0'
    }),
  image: z.string({
    required_error: 'Provide an url for the image'
  }).url({
    message: 'Invalid URL'
  }).regex(/\.(jpeg|jpg|png|gif|bmp|webp|svg)$/, {
    message: 'URL must link to an image, for example .jpg, .png ...'
  }),
  tags: z.array(z.string(), { required_error: 'Select at least one tag' })
})
