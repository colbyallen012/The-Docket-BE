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

  describe('GET /api/v1/grocery_items', () => {
    it('should return a status of 200 and all of the grocery items', async () => {
      const expectedItems = await database('grocery_items').select();
      const response = await request(app).get('/api/v1/grocery_items')
      const groceryItems = response.body
      expect(response.status).toBe(200);
      expect(groceryItems[0].item).toEqual('eggs')
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

    it('SAD PATH: should return 409 status and grocery list exists message', async () => {
      const newList = {list_title: 'grocery list 1'}
      const response = await request(app).post('/api/v1/groceryLists').send(newList)
      const errorMessage = 'grocery list 1 already exists.';
      expect(response.status).toBe(409);
      expect(response.body).toEqual(errorMessage);
    })
  })

  describe('POST /api/v1/grocery_items', () => {
    it('HAPPY PATH: should post a new item to the grocery list', async () => {
      const newItem = {item_id: 6,list_title: 'grocery list 1', item: 'cake'}
      const response = await request(app).post('/api/v1/grocery_items').send(newItem)
      const items = await database('grocery_items').where({ id: response.body.id });
      const newItems= items[0]
      expect(response.status).toBe(201)
      expect(newItems.item).toEqual(newItem.item)
    })

    it('SAD PATH: Should return a 422 status if the item already exists', async () => {
      const newItem = {item_id: 6,list_title: 'grocery list 1', item: 'eggs'}
      const response = await request(app).post(`/api/v1/grocery_items`).send(newItem);
      expect(response.status).toBe(422)
    })
  })

  describe('DELETE /api/v1/groceryLists/:id', () => {
    it('HAPPY PATH: should return a status of 204 when a grocery list is deleted', async () => {
      const expectedId = await database('groceryLists').first('id').then(object => object.id);
      const response = await request(app).delete(`/api/v1/groceryLists/${expectedId}`)
      expect(response.status).toBe(204)
    })

    it('SAD PATH: should return a 404 if a request id is bad', async () => {
      const response = await request(app).delete('/api/v1/groceryLists/-2')
      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /api/v1/grocery_items/:id', () => {
    it('HAPPY PATH: should return a status of 204 when an item is deleted', async () => {
      const expectedId = await database('grocery_items').first('id').then(object => object.id);
      const response = await request(app).delete(`/api/v1/grocery_items/${expectedId}`)
      expect(response.status).toBe(204)
    })

    it('SAD PATH: should return a 404 if a request id is bad', async () => {
      const response = await request(app).delete('/api/v1/grocery_items/-2')
      expect(response.status).toBe(404)
    })
  })
})