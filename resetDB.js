import { createInterface } from 'node:readline'
import { connectDB } from './lib/connectDB.js'
import { User } from './models/User.js'
import { Product } from './models/Product.js'

// function to ask the user if he is SURE about RESSETING teh database, and returns the answer
const ask = questionText => {
  return new Promise((resolve, reject) => {
    const consoleInterface = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    consoleInterface.question(questionText, answer => {
      consoleInterface.close()
      resolve(answer)
    })
  })
}

// function to reset the Users
const resetUsers = async () => {
  try {
    // delete all Users in the MONGODB and store them in 'deletedUsers'
    const deletedUsers = await User.deleteMany()
    // log the number of Users deleted using the 'deletedUsers'
    console.log(`Deleted ${deletedUsers.deletedCount} users`)

    // insert DEFAULT users in the MONGODB and store them in 'defaultUsers'
    const defaultUsers = await User.insertMany([
      {
        email: 'codesthenos@code.com',
        password: await User.hashPassword('123456')
      },
      {
        email: 'ataraxia@code.com',
        password: await User.hashPassword('654321')
      }
    ])
    // log the number of users created using 'defaultUsers'
    console.log(`Inserted ${defaultUsers.length} users`)
  } catch (error) {
    console.error('ERROR RESETTING USERS', error)
  }
}

// function to reset the Products
const resetProducts = async () => {
  try {
    // delete all Products in the MONGODB and store them in 'deletedProducts'
    const deletedProducts = await Product.deleteMany()
    console.log(`Deleted ${deletedProducts.deletedCount} products`)

    // store the Users needed to create the Products (Product owners)
    const [codesthenos, ataraxia] = await Promise.all([
      User.findOne({ email: 'codesthenos@code.com' }),
      User.findOne({ email: 'ataraxia@code.com' })
    ])

    // insert DEFAULT Products and store them in 'defaultProducts'
    const defaultProducts = await Product.insertMany([
      {
        name: 'Clases',
        price: 40,
        image: '/productsImages/clase-strength-gains.jpg',
        tags: ['work', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Camiseta',
        price: 12,
        image: '/productsImages/camiseta-strength-gains.jpg',
        tags: ['work'],
        owner: ataraxia._id
      },
      {
        name: 'Esterilla',
        price: 20,
        image: '/productsImages/esterilla-fitness.jpg',
        tags: ['work'],
        owner: ataraxia._id
      },
      {
        name: 'Honda cbr',
        price: 9000,
        image: '/productsImages/Honda-CBR650R-2023-1200x899.jpg',
        tags: ['motor'],
        owner: codesthenos._id
      },
      {
        name: 'Xiaomi 12',
        price: 130,
        image: '/productsImages/xiaomi-12.png',
        tags: ['mobile'],
        owner: codesthenos._id
      }
    ])
    console.log(`Inserted ${defaultProducts.length} products`)
  } catch (error) {
    console.error('ERROR RESETTING PRODUCTS', error)
  }
}

// Connect to MONGO database
try {
  const connection = await connectDB()
  console.log('CONNECTED TO MONGODB', connection.name)
} catch (error) {
  console.error('ERROR CONNECTING MONGODB', error)
}

// Ask if SURE to RESET
try {
  const responseAsk = await ask('Are you sure about RESETTING the DATABASE to DEFAULT values?\n')
  if (responseAsk.toLowerCase().trim() !== 'yes') {
    console.log('RESET ABORTED')
    process.exit()
  }
} catch (error) {
  console.error('ERROR', error)
}

// Reset Users
try {
  await resetUsers()
} catch (error) {
  console.error('ERROR resetting Users', error)
}

// Reset Prodcuts
try {
  await resetProducts()
} catch (error) {
  console.error('ERROR resetting Products', error)
}

// end process
process.exit()
