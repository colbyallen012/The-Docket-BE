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

module.exports = app;