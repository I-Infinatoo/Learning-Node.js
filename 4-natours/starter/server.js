// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const app = require('./app');
// //  this will configure the variables defined in the .env file 
// dotenv.config({ path: './config.env' });
// /**
//  * To get the current environment we are in ..
//             console.log(app.get('env'));
//  */

// /**
//  *  all environment variable 
//         console.log(process.env);
//  */
// const DBConnect = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// /**
//  * this will replace the `<PASSWORD>` with the password stored in the config file
//  * and form a string
//  */

// mongoose.connect(DBConnect, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// }).then(() => console.log("DB Connection Successful"));

// // basic schema can used for the DB
// /*
// const tourSchema = new mongoose.Schema({
//     name: String, 
//     rating: Number, 
//     price: Number
// });
// */

// /**
//  *  We can also use schema type object, while defining the schema for the model
//  */
// //using schema type object

// const tourSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "A tour must have the name!"],
//         /**
//          * 1st arg of array: true ==> this field is required
//          * 2nd arg of array: "<error message>" ==> in case the field is left unfilled
//         */
//         unique: true
//     },

//     rating: {
//         type: Number,
//         default: 4.5
//     },

//     price: {
//         type: Number,
//         required: [true, "A tour must have a price"]
//     }
// });

// //creating the `model` from the schema
// const Tour = mongoose.model('Tour', tourSchema);
// //                         'model name', 'schema*'

// // document to be stored in the DB
// const testTour = new Tour({
//     name: "The park camper",
//     price: 997
// });

// //saving the document to the DB
// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log("ERROR!💥 :", err);
// });

// const port = 3000 || process.env.PORT;
// app.listen(port, () => {
//     console.log(`running on ${port} ... `);
// });



//-----------------------------------------------------------------------//
//---------------------- MVC Refactoring --------------------------------//
//-----------------------------------------------------------------------//


const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);

    //in case of these kind of errors it is adviced to shutdown the application for the maintanance
    console.log('Uncought exception!... shuting down the application');

    process.exit(1);
});


//  this will configure the variables defined in the .env file 
dotenv.config({ path: './config.env' });
const app = require('./app');
/**
 * To get the current environment we are in ..
 console.log(app.get('env'));
 */

/**
 *  all environment variable 
 console.log(process.env);
 */
const DBConnect = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
/**
 * this will replace the `<PASSWORD>` with the password stored in the config file
 * and form a string
 */

mongoose.connect(DBConnect, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

}).then(() =>
    console.log("DB Connection Successful")

)
//  :::::::::::: We can handle the rejections globally to make it look it nice and easy to debug
// // to handle the unhandled rejections 
// .catch(err => {
//     console.log('ERROR!');
// });



const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`running on ${port} ... `);
});

// missing 'n' at the end of the passwd

//global : unhandled rejections
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);

    //in case of these kind of errors it is adviced to shutdown the application for the maintanance
    console.log('Unhandled Rejection!... shuting down the application');

    server.close(() => {

        process.exit(1);
    })
});
