// const express = require('express');
// const app = express();

const app = require('./app')

app.set('port', process.env.PORT || 3000);
// app.locals.title = 'The Docket';

// app.get('/', (request, response) => {
//   response.send(`What's on The Docket?`);
// });

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

module.exports = app;