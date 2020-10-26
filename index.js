// console.log("hello there Web 35!!!!")

//1 )server dependencies:
// import express from 'express' // package.json needs a "type key with a value of "module"
const express = require('express'); //cmmonjs module system that came with Node
const shortid = require('shortid');

//import { generate } from 'shortid' //ES6 modules
const generate = require('shortid').generate

//2) Instantiate and configure the server
const app = express() // here is our app (our server)
app.use(express.json()) // plugging in a piece of middleware

//3) decide a port number
const PORT = 5000;

//4) FAKE FATA
const dogs = [
    {
    id: generate(),
    name: 'Scout', 
    breed: 'Schanuzer'
    },
]

//5) Endpoint
// [GET] all the dogs in the DB
// catch all endpoint (404 resource not found)

app.get('/dogs', (req, res) => {
    res.status(200).json(dogs)
})
//[GET] dog by ID
app.get('/dogs/:id', (req, res) => {
    //1) pull out the id from the request (url param)
    const { id } = req.params
    // res.json(id)
    //2) find the dog in the dogs array with the given id
    const dog = dogs.find(dog => dog.id === id);
    //3) set status code and send back the dog
    // res.status(200).json(dog)
    if (!dog) {
        //set 404 and send something decent
        res.status(404).json({  message: `No dog found with id ${id}!` })
    } else {
        res.status(200).json(dog)
    }
})

//[POST] dog using the request body as raw material
app.post('/dogs', (req, res) => {
    //1) Pull out the { name, breed } from the body of the request
    const { name, breed } = req.body
    // console.log(name, breed)
    //2) make sure body includes name & breed
    if(!name || !breed) {
        res.status(400).json({
            message: 'Name and breed are required'
        })
    } else {
    //3) make a new resource, complete with unique ID
    const newDog = { id: generate(), name, breed }
    //4) add the new dog to our fake DB
    dogs.push(newDog)
    //5) send back the newly created resource
    res.status(201)
    }
})

//  [PUT] replace dog with given id (params) with the { name, breed }

app.put('/dogs/:id', (req, res) => {
    //1) pull id from params
    const { id } = req.params

    //2) pull name and breed from body
    const { name, breed } = req.body

    //3) validate id and validate req body
    const indexOfDog = dogs.findIndex(dog => dog.id === id)

    //4) find the dog and swap "breed" and "name"
    if (indexOfDog != -1) {
        dogs[indexOfDog] = { id, name, breed }
    


    //5) send back the updated response
    res.status(200).json({ id, name, breed })
    } else {
        res.status(404).json({ 
            message: `There is no dog with ID ${id}`
    })
    }
})

//[DELETE] remove dog with given ID in params
app.delete('/dogs/:id', (req,res) => {

    //1) find dog by given id
    //2) remove it from the array
    //3) send back something...

    const { id } = req.params
    
    try {
        if(!dogs.find(dog => dog.id === id)) {
            res.status(404).json({ message: 'Not Found'})
        } else {
            dogs = dogs.filter(dog => dog.id !== id)
            res.status(200).json({ message: `dog with id ${id} has been deleted`})
        }
        //if there is a crash here
        //instead of the app crashing
        // the block inside the catch will run
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})


//CATCH ALL [GET, POST, ...]
app.use('*', (req, res) => {
    res.status(404).json({  message: 'Not Found!' })
})

//6) Listen for incoming requests
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})