const mongoose = require('mongoose');

// Info is loaded from `.env` file
const url = process.env.MONGODB_URI;

//console.log('Trying to connect to', url);

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MondoDB');
  }).catch(error => {
    console.log('Connection failed:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^(?!-)(\d{2,3}-\d+)(?<!-)$/gm.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number is required']
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);