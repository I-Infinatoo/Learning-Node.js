const slugify = require('slugify');
const mongoose = require('mongoose');
const validator = require('validator');
// const User = require('./userModel');    // used when embedding

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
        trim: true,
        /**
         * 1st arg of array: true ==> this field is required
         * 2nd arg of array: "<error message>" ==> in case the field is left unfilled
        */
        unique: true,

        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
        // validate: [validator.isAlpha, "Tour name must only contain characters"]
    },

    //added for the slug to get saved in DB, without adding SLUG in the schema, we would not 
    //be able to use it i.e. slug will not show the o/p either on console nor in DB
    slug: { type: String },

    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A Tour must have a maximum group size"]
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,

        validate: {

            // `val` is the value that is passed through the input ..in `priceDiscount`
            validator: function (val) {
                // `this` only points to current doc on NEW document creation
                return val < this.price;    // 100 < 200
            },
            //                         VALUE have the access to the input value
            message: "Discount price ({VALUE}) should be less than price"
            //                         this feature is internal to mongoose
        }

    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A Tour must have a summary"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        /**
         * In imageCover string we will only store the file name of the image
         * (so that it can be used as a reference to search 
         * in the folder of the images (not in the DB) )
         * not the image itself in the DB, in order to make the DB lighter
        */
        required: [true, "A Tour must have a cover image"]
    },
    //an array of strings
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    
    // for query middleware
    secretTour: {
        type: Boolean,
        default: false
    },
    
    startLocation: {
        //GeoJSON   
        type: {
            typr: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },

    //embedded document 
    locations:[
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // guides: Array    // `Array` is used because we do not know the type of data which has to be embedded
    guides: [
        {
            type: mongoose.Schema.ObjectId,     // this will indicate the mongoose about the type of data which will come here
            ref: 'User'    
        }
    ]

},
{   //it is used for the virtual property, to only push the specified fields only in the json file
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


//this virtual function is used to calculate the duration in weeks from the stored entity 'duration in days'
//normal funtion is used inside get() instead of '=>' function, as '=>' does not have `this` keyword
//get() is used so that this virtual function will envoked when there is a get request

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})


/**
 *    The virtual function to populate the tour virtually with the review fields
 * 
*/
tourSchema.virtual('reviews', {
    ref: 'Review',      // ref. schema
    foreignField: 'Tour',       // field-name in the review schema which is pointing to the tour
    localField: '_id'    // field in the review model to ge the reference of it to here
})


// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// here hook is `save`
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// here we are replacing the user id provided in the body with the user from the user schema...
// -------------------------------------------- making it `embedded type` -----------------------------------------------
/*
tourSchema.pre('save', async function(next) {
    
    const guidesPromise = this.guides.map( async id =>  await User.findById(id) );  //.findById() returns the promise
    // and guidesPromise is an array... therefore it is full of promises
    // thatis why we have to use promise.all()
    this.guides = await Promise.all(guidesPromise);
    next();
})
*/
// ----------------------------------------------------------------------------------------------------------------------

//another pre-middleware for testing 
// tourSchema.pre('save', function (next) {
//     console.log('Will save the document...');
//     next();
// })

// // doc => recently saved socument
// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })



// QUERY MIDDLEWARE: here hook is `find`
// here there is no `this` keyword
/*
 this middle ware will get exwcuted like other schema middleware (by default)
 that is acc. to this query middleware-- by default application will show the fileds having
 secretTour field `false`
*/

/**
 * this middlewaare will only work for `find` request
 * this will not work for `findOne`, `findOneAndDelete` ....
 * all the functions are given in the documentation of mongoose
 * 
    tourSchema.pre('find', function (next) {
 
                                //not equals
        this.find({ secretTour: { $ne: true } });
        next();
    })
 * 
 * to make it generic we use REGULAR FUNCTION:
 *                      we can use ` /^find/ ` instead of using 'find'
 */

// all the strings starts with `find`
tourSchema.pre(/^find/, function (next) {

    //not equals
    this.find({ secretTour: { $ne: true } });

    //to get the time of execution
    this.start = Date.now();

    next();
})

tourSchema.pre(/^find/, function(next) {

    this.populate({
        
        path: 'guides',     // follow this path to refer
        select: '-__v -passwordChangedAt'   // this will exclude these fields from display
    });
        
    next();
})

tourSchema.post(/^find/, function (docs, next) {

    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    // console.log(docs);
    next();
})



//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {

    //shift --> at the end of the array
    //unshift --> at the begning of the array
    //methods on array to insert new element in JS

    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});


//creating the `model` from the schema
const Tour = mongoose.model('Tour', tourSchema);
//                         'model name', 'schema*'


module.exports = Tour;