const { factory } = require('factory-girl')
const faker = require('faker')

const {
  User,
  Property,
  Image,
  Rental,
  Favorite
} = require('../src/models')

factory.define('User', User, {
  email: faker.internet.email,
  password: "12345678",
  name: "Alexander Augusto",
  cpf: "111.111.111-11",
  phone: "35984529203",
  avatar: "default-avatar.png"
})

factory.define('Property', Property, {
  title: "Casa da Praia",
  description: "Esta casa possui vista para o mar e é muito bonita",
  animal: true,
  street: "Avenida João de Camargo",
  city: "Santa Rita do Sapucaí",
  state: "MG",
  country: "Brasil",
  price: 1300.50,
  bedrooms: 3,
  bathrooms: 1,
  area: 35,
  place: 3,
  type: "Apartamento",
  user_id: async () => {
    const user = await factory.create('User')
    return user.id
  }
})

factory.define('Image', Image, {
  path: "<IMAGE_PATH>",
  property_id: async () => {
    const property = await factory.create('Property')
    return property.id
  }
})

factory.define('Rental', Rental, {
  user_id: async () => {
    const user = await factory.create('User')
    return user.id
  },
  property_id: async () => {
    const property = await factory.create('Property')
    return property.id
  }
})

factory.define('Favorite', Favorite, {
  user_id: async () => {
    const user = await factory.create('User')
    return user.id
  },
  property_id: async () => {
    const property = await factory.create('Property')
    return property.id
  }
})

module.exports = factory