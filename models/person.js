const mongoose = require('mongoose');

// Info is loaded from `.env` file
const url = process.env.MONGODB_URI;

console.log('Trying to connect to', url);

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MondoDB');
    }).catch(error => {
        console.log('Connection failed:', error.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 6,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema);