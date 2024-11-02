import readline from 'node:readline'
import { connectDB } from './lib/connectDB.js'
import { User } from './models/User.js'

// function to ask the user if he is SURE about RESSETING teh database, and returns the answer
const ask = questionText => {
  return new Promise((resolve, reject) => {
    const consoleInterface = readline.createInterface({
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
  process.exit()
} catch (error) {
  console.error('ERROR resetting Users', error)
}
