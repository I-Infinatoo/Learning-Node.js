// /**
//  * 
//  * As we have multiple consts to export from this file to the other js
//  * therefore we cannot use the `module.export` function as it exports only one object
//  * from the file.
//  * 
// */

// /**
//  * 
//  *  Therefore we will be using : put all the functions on the export's object
//  *  
// */

// const query = require('express/lib/middleware/query');
// const Tour = require('./../models/tourModel.js');

// /**
//  * 
//  *  `param` is the middleware is used to operate when there is a particular url requseted
//  * 
//  *  - in this case, this is `id`, 
//  *  -   (val) => parameter is the parameter passed in the .param() function
//  *  - in this case val ==> id  
//  *  
// */

// exports.aliasTopTour = (req, res, next) => {
//     req.query.limit = '5';
//     req.query.sort = '-ratingdAverage,price';
//     req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//     next();
// };

// exports.getAllRoute = async (req, res) => {

//     try {

//         //build the query
//         // 1A) FILTERING
//         /**
//          * now filter the query for eg.`page=2

//                 `const queryObj = req.query`
//                 this will create a soft copy of req.query to the queryObj
//                 which means that, only reference of the query is paased to queryObj

//                 any change in the query will also update the query onject

//                 and `...` => will extract all the fields from the query
//                 and  `{}` => will create a brand new onject for query oject
//         **/
//         const queryObj = { ...req.query };
//         /** 
//          * now remove the selected portions of the query.....
//         */
//         const excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(ele => delete queryObj[ele]);
//         //queryObj => constains the query without page, sort, etc. ..
//         //req.query => contains the original query
//         // console.log(req.query, queryObj);

//         /*console.log(req.query);
//         const tours = await Tour.find({
//             duration: 5,
//             difficulty: 'easy'
//         });
//         */

//         /*const tours = Tour.find()
//             .where('duration').equals(5)
//             .where('difficulty').equals('easy');
//         */

//         // 1B) ADVANCED FILTERING
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//         //replace `match` with `$match`
//         // console.log(JSON.parse(queryStr));

//         //query => contains the ${gte} , etc. ..
//         let query = Tour.find(JSON.parse(queryStr));

//         /**
//          * .find() also accepts the jason formated file structure to find the data 
//          * from the data base.      That is why `req.query` can be passed directly 
//          * to the `.find()` function
//         */

//         /**
//          * .find() will return the array of documents of DB
//         */

//         // 2) SORTING

//         /**
//          * Chain the sorting method to the query object
//          */
//         if (req.query.sort) {
//             const sortBy = req.query.sort.split(',').join(' ');
//             /**
//              * the above statement will split the sort query on the basis of `,` and
//              * join them on the basis of `<space>`
//              */
//             query = query.sort(sortBy)
//         } else { // default sort
//             query = query.sort('-createdAt'); // `-` for decreasing order
//         }
//         // console.log(req.query);


//         // 3) Filed Limiting
//         /**
//          * only sending requested field by the user
//         */

//         if (req.query.fields) {
//             const fieldBy = req.query.fields.split(',').join(' ');
//             query = query.select(fieldBy);
//         } else {
//             query = query.select('-__v');
//         }


//         // 4) Pagination
//         const page = req.query.page * 1 || 1;
//         const limit = req.query.limit * 1 || 100;
//         const skip = (page - 1) * limit;

//         query = query.skip(skip).limit(limit);

//         if (req.query.page) {
//             const numTours = await Tour.countDocuments();
//             if (skip >= numTours) {
//                 throw new ERROR("This page does not exists");
//             }
//         }


//         // EXECUTE THE QUERY
//         const tours = await query;

//         // send response
//         res.status(200).json({
//             status: 'success',
//             result: tours.length,
//             data: {
//                 tours
//             }
//         });
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }

// exports.getTour = async (req, res) => {

//     try {
//         const tour = await Tour.findById(req.params.id);
//         //Tour.findOne({ _id: req.params.id });

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 tour
//             }
//         })
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }

// }

// exports.createTour = async (req, res) => {

//     try {
//         const newTour = await Tour.create(req.body);
//         /**
//          * here newTour will store the result processed by `await` version of `tour.create()`
//          * else only `Tour.create()` will return a promise, which can further be used by using 
//          * `.then()` and `.catch()` method
//          */
//         /** 
//          * While using async and await property...
//          * we are required/advised to use the function in try-catch block
//          */
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: 'Invalid data sent!'
//         });
//     }
// }

// exports.updateTour = async (req, res) => {

//     try {

//         const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             updateValidators: true
//         });

//         res.status(200).json({
//             status: "success",
//             data: {
//                 tour
//             }
//         })

//     } catch (err) {

//         res.status(404).json({
//             status: "fail",
//             message: err
//         })
//     }

// }


// exports.deleteTour = async (req, res) => {
//     try {

//         await Tour.findByIdAndDelete(req.params.id);

//         res.status(200).json({
//             status: "success"
//         });

//     } catch (err) {
//         res.status(404).json({
//             status: "fail",
//             message: "err"
//         });
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })

// }


/**
 * ========================================================================
 *         ================REFACTORING API FEATURE==================
 * ========================================================================
 * 
*/


/**
 * 
 * As we have multiple consts to export from this file to the other js
 * therefore we cannot use the `module.export` function as it exports only one object
 * from the file.
 * 
*/

/**
 * 
 *  Therefore we will be using : put all the functions on the export's object
 *  
*/

//const query = require('express/lib/middleware/query');
const Tour = require('./../models/tourModel.js');
const APIFeature = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

/**
 * 
 *  `param` is the middleware is used to operate when there is a particular url requseted
 * 
 *  - in this case, this is `id`, 
 *  -   (val) => parameter is the parameter passed in the .param() function
 *  - in this case val ==> id  
 *  
*/

exports.aliasTopTour = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingdAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};


//made class under factoring of APIFeatures ...is now in the ./../utils/apiFeatures



exports.getAllRoute = catchAsync(async (req, res, next) => {

    const features = new APIFeature(Tour.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate()

    const tours = await features.query;

    // send response
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
})

exports.getTour = catchAsync(async (req, res, next) => {

    //  `.populate()` is used when using referencing type model
    // const tour = await Tour.findById(req.params.id).populate('guides');     // `populate()` will replace the ref. with the actual object for display
    //Tour.findOne({ _id: req.params.id });

    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError(`No tour found with ${req.params.id} id`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})


exports.createTour = catchAsync(async (req, res, next) => {

    const newTour = await Tour.create(req.body);
    /**
     * 
     * 1. catchAsync function is called in which this steps will be performed
     * 2. if there is an error in any stated steps ... then these line of code will not return a promise
     * 3. then `fn()` will catch the error and pass it to the `next()` ... to the global handler
     * 4. in case of no error, a new annonymous function will be created and assigned to `createTour`
     * 
     * 5. now catchAsync is moved to file `catchAsync.js`
     */
    /** 
     * While using async and await property...
     * we are required/advised to use the function in try-catch block
     */
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });

});

exports.updateTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        updateValidators: true
    });

    if (!tour) {
        return next(new AppError(`No tour found with ${req.params.id} id`, 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
})


exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError(`No tour found with ${req.params.id} id`, 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    })

})


//aggregation  => it is a pipe line provided by mongoDB
exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                //  "_id: ==> what we want to group by"
                // _id: none,       // => this will group the calculated fields accourding to the passed values
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        }
        // ,{
        //     $match: {
        //         _id: { $ne: 'EASY' }
        //     }
        // }
    ])

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    })
})


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;   //2021
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'  //this will unwind the array of start dates
            //and then we can access them seperately
        },
        {
            $match: {
                //to match the dates between 01-Jan-${year} to 31-Dec-${year}
                startDates: {
                    $gte: new Date(`${year}-01-01`),

                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            //group by start dates (month) and also count the number of tours starting in a month
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }   //will tell the name of that tour...   $push is used to create the array
            }
        },
        {
            // add a new field in the results as=>  name_of_the_field : value_of_the_field 
            $addFields: { month: '$_id' }
        },
        {
            //it will control what data will be displayed on the screen
            $project: {
                _id: 0
            }
        },
        {
            //here `-1` instructs to sort in descending order and `+1` for accending
            $sort: { numTourStarts: -1 }
        },
        {
            //will set the number of results has to be shown on the screen
            $limit: 15
        }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })
})