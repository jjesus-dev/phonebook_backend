const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

let numbers = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return `- ${JSON.stringify(req.body)}`;
    } else {
        return ''
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
    response.send('<p>Phone numbers</p>');
})

app.get('/info', (request, response) => {
    const count = numbers.length;
    const now = new Date();
    const message = `<p>Phonebook has info for ${count} people</p><br /><p>${now.toString()}</p>`;

    response.send(message);
})

app.get('/api/persons', (request, response) => {
    response.json(numbers);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const number = numbers.find(n => n.id === id);

    if (!number) {
        return response.status(404).end();
    }

    response.json(number);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    numbers = numbers.filter(n => n.id !== id);

    response.status(204).end();
})

const getRandomId = () => {
    const newId = Math.floor(Math.random() * 500);

    return newId;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400)
            .json({ error: "Name is missing"});
    }

    if (!body.number) {
        return response.status(400)
            .json({ error: "Number is missing"});
    }

    const existingName = numbers.find(n => 
        n.name.toLowerCase() === body.name.toLowerCase());

    if (existingName) {
        return response.status(409)
            .json({ error: "Name must be unique"});
    }

    const number = {
        name: body.name,
        number: body.number,
        id: getRandomId()
    }
    
    numbers = numbers.concat(number);

    response.json(number);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})