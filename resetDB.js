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
    // DEFAULT PRODUCTS
    const products = [
      { name: 'Clases', price: 40, image: '/productsImages/clase-strength-gains.jpg', tags: ['work', 'lifestyle'], owner: ataraxia._id },
      { name: 'Camiseta', price: 12, image: '/productsImages/camiseta-strength-gains.jpg', tags: ['work'], owner: ataraxia._id },
      { name: 'Esterilla', price: 20, image: '/productsImages/esterilla-fitness.jpg', tags: ['work'], owner: ataraxia._id },
      { name: 'Honda cbr', price: 9000, image: '/productsImages/Honda-CBR650R-2023-1200x899.jpg', tags: ['motor'], owner: codesthenos._id },
      { name: 'Xiaomi 12', price: 130, image: '/productsImages/xiaomi-12.png', tags: ['mobile'], owner: codesthenos._id },
      {
        name: 'Smartphone X',
        price: 599,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['mobile', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Laptop Pro',
        price: 1299,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['work', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Wireless Earbuds',
        price: 129,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['mobile', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Smart Watch',
        price: 249,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['mobile', 'lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Fitness Tracker',
        price: 79,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Electric Scooter',
        price: 399,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['motor', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Drone Camera',
        price: 799,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Gaming Console',
        price: 499,
        image: 'https://img.pccomponentes.com/articles/1076/10762131/1133-xbox-series-s-1tb-negro-carbon.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'VR Headset',
        price: 299,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Bluetooth Speaker',
        price: 89,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle', 'mobile'],
        owner: ataraxia._id
      },
      {
        name: 'Coffee Maker',
        price: 129,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Air Fryer',
        price: 99,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Robot Vacuum',
        price: 299,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Electric Toothbrush',
        price: 59,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Hair Dryer',
        price: 49,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Portable Charger',
        price: 39,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['mobile', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Wireless Mouse',
        price: 29,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['work'],
        owner: ataraxia._id
      },
      {
        name: 'Ergonomic Keyboard',
        price: 99,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['work'],
        owner: ataraxia._id
      },
      {
        name: 'External SSD',
        price: 129,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['work', 'mobile'],
        owner: ataraxia._id
      },
      {
        name: 'Noise-Cancelling Headphones',
        price: 199,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle', 'work', 'mobile'],
        owner: ataraxia._id
      },
      {
        name: 'Action Camera',
        price: 249,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'E-reader',
        price: 119,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle', 'mobile'],
        owner: ataraxia._id
      },
      {
        name: 'Smartpen',
        price: 149,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['work'],
        owner: ataraxia._id
      },
      {
        name: 'Portable Projector',
        price: 299,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['work', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Wi-Fi Router',
        price: 79,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['work', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Dash Cam',
        price: 89,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['motor'],
        owner: ataraxia._id
      },
      {
        name: 'Smart Thermostat',
        price: 179,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Security Camera',
        price: 129,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Smart Lock',
        price: 199,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Video Doorbell',
        price: 149,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Electric Skateboard',
        price: 499,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle', 'motor'],
        owner: ataraxia._id
      },
      {
        name: 'Foldable Bike',
        price: 799,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle', 'motor'],
        owner: ataraxia._id
      },
      {
        name: 'Massage Gun',
        price: 199,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Smart Scale',
        price: 59,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Sleep Tracker',
        price: 99,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Portable Espresso Maker',
        price: 89,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'UV Phone Sanitizer',
        price: 49,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle', 'mobile'],
        owner: ataraxia._id
      },
      {
        name: 'Smart Water Bottle',
        price: 39,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Wireless Charging Pad',
        price: 29,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['mobile', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Neck Massager',
        price: 69,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Smart Light Bulbs',
        price: 39,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Portable Blender',
        price: 29,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Digital Notepad',
        price: 199,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['work'],
        owner: ataraxia._id
      },
      {
        name: 'Smart Plant Pot',
        price: 59,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Posture Corrector',
        price: 29,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Reusable Straws Set',
        price: 15,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Collapsible Water Bottle',
        price: 25,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Eco-friendly Lunchbox',
        price: 35,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle', 'work'],
        owner: ataraxia._id
      },
      {
        name: 'Solar Power Bank',
        price: 49,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['mobile', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Bamboo Cutlery Set',
        price: 19,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Reusable Produce Bags',
        price: 15,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Biodegradable Phone Case',
        price: 29,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['mobile', 'lifestyle'],
        owner: ataraxia._id
      },
      {
        name: 'Recycled Plastic Backpack',
        price: 79,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle', 'work'],
        owner: codesthenos._id
      },
      {
        name: 'Sustainable Yoga Mat',
        price: 69,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Eco-friendly Sunglasses',
        price: 99,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Electric Longboard',
        price: 599,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle', 'motor'],
        owner: codesthenos._id
      },
      {
        name: 'Foldable Kayak',
        price: 999,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Inflatable Paddleboard',
        price: 499,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Portable Hammock',
        price: 59,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Stove',
        price: 89,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Hiking Boots',
        price: 149,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Waterproof Camera',
        price: 299,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Survival Multi-tool',
        price: 49,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Solar Lantern',
        price: 39,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Insulated Water Bottle',
        price: 29,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Compact Binoculars',
        price: 79,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Trekking Poles',
        price: 69,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Pillow 2',
        price: 29,
        image: 'https://americanblossomlinens.com/cdn/shop/files/Two_Pillows_Stacked_Bed_Pillow_Natural_Cotton_Wool_Fill_Made_in_USA_2048x.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Portable Water Filter',
        price: 39,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Emergency Radio',
        price: 49,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Folding Saw',
        price: 29,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Bear Spray',
        price: 39,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Cot',
        price: 89,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Dry Bag',
        price: 29,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Headlamp',
        price: 39,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Mosquito Repellent Bracelet',
        price: 15,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Chair',
        price: 49,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Firestarter Kit',
        price: 19,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Cookware Set',
        price: 79,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Sleeping Bag',
        price: 89,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Tent',
        price: 199,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Backpacking Backpack',
        price: 149,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Axe',
        price: 59,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Portable Camping Shower',
        price: 89,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Table',
        price: 69,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Fan',
        price: 29,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Grill',
        price: 79,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Coffee Maker',
        price: 39,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Utensil Set',
        price: 19,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Blanket',
        price: 49,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Towel',
        price: 29,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'First Aid Kit',
        price: 39,
        image: 'https://i.ebayimg.com/images/g/N5YAAOSwXk1lQLGV/s-l1200.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Knife',
        price: 49,
        image: 'https://cdn.dribbble.com/users/493139/screenshots/5151293/media/5ae97bf1f2b746d375dc19acb419b9d2.png',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Pillow',
        price: 25,
        image: 'https://americanblossomlinens.com/cdn/shop/files/Two_Pillows_Stacked_Bed_Pillow_Natural_Cotton_Wool_Fill_Made_in_USA_2048x.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      },
      {
        name: 'Camping Lantern',
        price: 35,
        image: 'https://i.ebayimg.com/images/g/nW4AAOSwpaVkd7i9/s-l400.jpg',
        tags: ['lifestyle'],
        owner: codesthenos._id
      }
    ]

    // insert DEFAULT Products and store them in 'defaultProducts'
    const defaultProducts = await Product.insertMany(products)
    console.log(`Inserted ${defaultProducts.length} products`)
  } catch (error) {
    console.error('ERROR RESETTING PRODUCTS', error.message)
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
