require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return `- ${JSON.stringify(req.body)}`;
  } else {
    return '';
  }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const errorHandler = (error, request, response, next) => {
  console.error('ERROR:', error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.get('/', (request, response) => {
  response.send('<p>Phone numbers</p>');
});

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(docs => {
    const count = docs;
    const now = new Date();
    const message = `<p>Phonebook has info for ${count} people</p><br /><p>${now.toString()}</p>`;

    response.send(message);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(numbers => {
    response.json(numbers);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(number => {
      response.json(number);
    }).catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  const person = new Person({
    name: name,
    number: number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson);
    }).catch(error => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});