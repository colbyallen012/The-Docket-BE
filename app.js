const express = require('express');
const app = express();
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const querystring = require('querystring');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.locals.title = 'The Docket Database';

app.get('/', (request, response) => {
});

app.get('/api/v1/groceryLists', (request, response) => {
  database('groceryLists').select()
    .then(groceryLists => response.status(200).json(groceryLists))
    .catch(error => response.status(500).json({error}))
});

app.post('/api/v1/groceryLists', (request, response) => {
  const groceryList = request.body;
  for(let requiredParameter of ['list_title']) {
    if(!groceryList[requiredParameter]) {
      return response
        .status(422)
        .send({error: `Expected format: {name: <String>}. You're missing the ${requiredParameter} property.`})
    }
  }
  database('groceryLists').where('list_title', groceryList.list_title).select()
    .then(existingList => {
      if(!existingList.length) {
        database('groceryLists').insert(groceryList, 'id')
          .then(groceryList => response.status(201).json({id: groceryList[0]}))
          .catch(error => response.status(500).json({error}))
      } else {
        response.status(409).json(`${groceryList.list_title} already exists.`)
      }
    })
});

app.delete('/api/v1/groceryLists/:id', (request, response) => {
  const {id} = request.params;
  database('groceryLists').where('id', id).select()
    .then(groceryList => {
      if(groceryList.length) {
        database('grocery_items').where('item_id', id).del()
          .then(() => {
            database('groceryLists').where('id', id).del()
              .then(() => response.status(204).json('Grocery list and items deleted'))
              .catch(error => response.status(500).json({error}))

          })
      } else {
        response.status(404).json('Grocery list does not exist')
      }
    })
})

module.exports = app;