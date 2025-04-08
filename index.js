const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0
    console.log(maxId)
    return String(maxId + 1)
}

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    req.method === 'POST' 
    ? morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next)
    : morgan('tiny')(req, res, next)
})


///////////////////////////////////////////////////////////////////////////

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)

    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    } else if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name already in phonebook'
        })
    }

    const id = Math.floor(Math.random() * 100000) + 1

    const person = {
        id: String(id),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)

    morgan.token('body', req => {
        return JSON.stringify(req.body)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

///////////////////////////////////////////////////////////////////////////

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
    console.log(`The magic is happening on port ${PORT}`)
})