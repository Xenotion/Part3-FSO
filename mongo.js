const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://xenotion:${password}@fso.bvdhkik.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const pbSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('phonebook', pbSchema)

const person = new Phonebook({
  name: name,
  number: number
})

if (name != null && number != null) {
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Phonebook.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(person => {
      console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
}



