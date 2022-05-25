const mongoose = require('mongoose');
// basic schema can used for the DB
/*
const tourSchema = new mongoose.Schema({
    name: String, 
    rating: Number, 
    price: Number
});
*/

/**
 *  We can also use schema type object, while defining the schema for the model
 */
//using schema type object


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have the name!"],
        /**
         * 1st arg of array: true ==> this field is required
         * 2nd arg of array: "<error message>" ==> in case the field is left unfilled
        */
        unique: true
    },

    rating: {
        type: Number,
        default: 4.5
    },

    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    }
});

//creating the `model` from the schema
const Tour = mongoose.model('Tour', tourSchema);
//                         'model name', 'schema*'


module.exports = Tour;