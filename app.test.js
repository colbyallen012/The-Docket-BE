const request = require('supertest');
const app = require('./app')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('API', () => {
  beforeEach(async () => {
    await database.seed.run()
  })
  describe('GET /api/v1/groceryLists', () => {
    it('should return a status of 200 and all of the groceryLists', async () => {
      const expectedLists = await database('groceryLists').select();
      const response = await request(app).get('/api/v1/groceryLists')
      const groceryLists = response.body
      expect(response.status).toBe(200);
      expect(groceryLists[0].list_title).toEqual('grocery list 1')
    })
  })
  describe('POST /api/v1/groceryLists', () => {
    it('HAPPY PATH should return 201 status and new object with id', async () => {
      const expectedId = await database('groceryLists').select('id')
        .then(groceryList => groceryList[0].id + 1)
      const expectedResponse = {id: expectedId}
      const newList = {list_title: 'grocery list 2'}
      const response = await request(app).post('/api/v1/groceryLists').send(newList)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(expectedResponse)
    })
  })
})