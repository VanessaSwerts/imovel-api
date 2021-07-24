const request = require('supertest')
const app = require('../../src/app')
const factory = require('../factories')
const truncate = require('../utils/truncate')
const deleteFile = require('../../src/utils/deleteFile')
const { generateJwt } = require('../../src/utils/auth')

describe("User test", () => {
  beforeEach(async () => {
    await truncate()
  })

  it("Should create a user without image using api route", async () => {
    const response = await request(app)
      .post("/user")
      .send({
        email: "alexaasf_10@hotmail.com",
        password: "12345678",
        name: "Alexander Augusto",
        cpf: "111.111.111-00",
        phone: "35984529203"
      })

    expect(response.status).toBe(201)
    expect(response.body.email).toBe("alexaasf_10@hotmail.com")
  })

  it("Should create a user with image using api route", async () => {
    const response = await request(app)
      .post("/user")
      .field("email", "alexaasf_10@hotmail.com")
      .field("password", "12345678")
      .field("name", "Alexander Augusto")
      .field("cpf", "111.111.111-00")
      .field("phone", "35984529203")
      .attach("file", "__tests__/utils/test.jpg")

    deleteFile("user/" + response.body.avatar)

    expect(response.status).toBe(201)
    expect(response.body.email).toBe("alexaasf_10@hotmail.com")
  })

  it("Should list a user using api route", async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${generateJwt({ id: user.id })}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(user.id)
  })

  it("Should list user properties using api route", async () => {
    const user = await factory.create('User')
    await factory.create('Property', {
      user_id: user.id
    })
    await factory.create('Property', {
      user_id: user.id
    })

    const response = await request(app)
      .get("/user/" + user.id + "/properties")
      .set("Authorization", `Bearer ${generateJwt({ id: user.id })}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)
  })
  
  it("Should list a autheticated user properties using api route", async () => {
    const user = await factory.create('User')
    await factory.create('Property', {
      user_id: user.id
    })
    await factory.create('Property', {
      user_id: user.id
    })

    const response = await request(app)
      .get("/user/properties")
      .set("Authorization", `Bearer ${generateJwt({ id: user.id })}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)
  })
  
  it("Should list user favorites using api route", async () => {
    const user = await factory.create('User')
    await factory.create('Favorite', {
      user_id: user.id
    })
    await factory.create('Favorite', {
      user_id: user.id
    })

    const response = await request(app)
      .get("/user/favorites")
      .set("Authorization", `Bearer ${generateJwt({ id: user.id })}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)
  })

  it("Should update a user using api route", async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .put("/user")
      .send({
        name: "Vanessa Swerts",
        cpf: "000.000.000-11"
      })
      .set("Authorization", `Bearer ${generateJwt({ id: user.id })}`)

    expect(response.status).toBe(204)
  })

  it("Should update a user image using api route", async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .put("/user/avatar")
      .attach("file", "__tests__/utils/test.jpg")
      .set("Authorization", `Bearer ${generateJwt({ id: user.id })}`)

    deleteFile("user/" + response.body.avatar)

    expect(response.status).toBe(200)
    expect(response.body.avatar).toBeTruthy()
  })

  it("Should delete a user using api route", async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .delete("/user")
      .set("Authorization", `Bearer ${generateJwt({ id: user.id })}`)

    expect(response.status).toBe(204)
  })
})