require('dotenv').config()
const express = require('express')
const app = express()
const Number = require('./models/numbers')






const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }



  next(error)

}


app.use(express.static('dist'))
app.use(express.json())
var morgan = require('morgan')
app.use(morgan('tiny'))



app.get('/api/persons', (request, response) =>
  Number.find({}).then((numbers) => {
    response.json(numbers)
  })

)

app.get('/api/info', (request, response) => {

  const time = new Date()

  Number.find({}).then((numbers) => {
    response.send(`<p>Phonebook has info for ${numbers.length} people</p><p>${time}</p>`)
  })
}
)

app.get('/api/persons/:id', (request, response, next) => {

  const id = request.params.id
  Number.findById(id)
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Number.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end()
      console.log(result)
    })
    .catch((error) => next(error))




})

app.post('/api/persons', (request, response, next) => {
  const random_id = Math.floor(Math.random() * 1000)
  const body = request.body
  console.log(body)




  /*   if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name missing or number missing'
    })
  }*/



  const number = new Number({
    name: body.name,
    number: body.number,
    id: random_id
  })



  number.save().then(result => {
    console.log('added', body.name, 'number', body.number, 'to phonebook')
    response.json(result)

  })
    .catch(error => next(error))
}
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})