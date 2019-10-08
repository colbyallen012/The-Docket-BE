const request = require('supertest');
const app = require('./app')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('API', () => {
  beforeEach(async () => {
    await database.seed.run()
  })
  describe('get /api/v1/groceryLists', () => {
    it('should return a status of 200 and all of the groceryLists', async () => {
      const expectedLists = await database('groceryLists').select();
      const response = await request(app).get('/api/v1/groceryLists')
      const groceryLists = response.body
      expect(response.status).toBe(200);
      expect(groceryLists[0].list_title).toEqual('grocery list 1')
    })
  })
})