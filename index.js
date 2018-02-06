const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', function (req){
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':data :method :url :status :res[content-length] - :response-time ms'))
app.use(cors())

let persons = [
  {name: "Arto Hellas",
  number: "040-123456",
  id: 1},
  {name: "Martti Tienari",
  number: "040-123456",
  id: 2},
  {name: "Arto Järvinen",
  number: "040-123456",
  id: 3},
  {name: "Lea Kutvonen",
  number: "040-123456",
  id: 4}
]
app.get('/', (req, res) => {
  res.send('<h1> Tervetuloa puhelinluettelon backend sovellukseen! </h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (rew, res) => {
  const date = new Date()
  res.send('<p> Puhelinluettelossa on ' + persons.length +' henkilön tiedot</p>'+
    date)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if(person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})
const  generateId = () => {
  const id = Math.floor(Math.random() * Math.floor(1000))
  return Number(id)
}
app.post('/api/persons', (req, res) => {
  const body = req.body
  if(body.name === undefined || body.number === undefined ) {
    return res.status(400).json({error: 'name or number missing'})
  }
  if(persons.find(x => x.name === body.name)) {
    return res.status(400).json({error: "Name is already in the list"})
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
