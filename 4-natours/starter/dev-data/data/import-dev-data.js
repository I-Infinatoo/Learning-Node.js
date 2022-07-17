const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DBConnect = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DBConnect, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("DB Connection Successful"));


//read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//import data into database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data Successfully loaded!');


    } catch (err) {
        console.log(err);
    }
    process.exit();
};

//delete all data from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data Successfully deleted!');


    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
}

if (process.argv[2] === '--delete') {
    deleteData();
}


// console.log(process.argv);