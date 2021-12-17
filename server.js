require('rootpath')();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('utils/errorHandler');

app.use(bodyParser.urlencoded({ extented: false}));
app.use(bodyParser.json());

app.use('/parents', require('./controllers/parents.controller'));
app.use('/children', require('./controllers/childrenController'));
app.use('/cards', require('./controllers/creditCard.controller'));

app.use(cors());
app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.port || 80) : 1000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});