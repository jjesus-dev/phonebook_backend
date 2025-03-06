const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Password is missing');
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log('Too many parameters (names with whitespaces should be enclosed in quotes).');
  process.exit(1);
}

const user = 'fullstack';
const password = process.argv[2];
const collection = 'phonebookApp';

const url = `mongodb+srv://${user}:${password}@${process.env.CLUSTER_NAME}/${collection}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', true);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
});

if (process.argv.length === 3) {
  console.log('Phonebook:');

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  person.save().then(result => {
    console.log(`added ${person.name}, number ${person.number} to phonebook.`);
    mongoose.connection.close();
  });
}
