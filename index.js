const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json());
app.use(cors())

let notes = [
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
    },
    { 
      "id": 5,
      "name": "yeet", 
      "number": "111111"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(
        `
        <p>Phonebook has info for ${notes.length} people</p>
        <br>
        <p>${date}</p>
        `
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id); 
    const note = notes.find(note => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end(); 
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const initialLength = notes.length;
    notes = notes.filter(note => note.id !== id);
    const wasDeleted = initialLength !== notes.length;

    if (wasDeleted) {
        response.status(204).end();
    } else {
        response.status(404).send({ error: 'Note not found' });
    }
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
      return response.status(400).json({ error: 'name or number is missing' });
  }

  const nameExists = notes.some(note => note.name.toLowerCase() === body.name.toLowerCase());

  if (nameExists) {
    return response.status(400).json({ error: 'name already exists'});
  }

  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
  const note = {
      id: maxId + 1,
      name: body.name,
      number: body.number,
  };

  notes = [ ...notes, note]
  response.json(notes);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// redeploy