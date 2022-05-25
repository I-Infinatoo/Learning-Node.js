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

// const fs = require('fs');
const Tour = require('./../models/tourModel.js');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {

//     console.log(`The requested id is: ${val}`);

//     // if (req.params.id * 1 > tours.length) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: "Invalid Id"
//     //     })
//     // }
//     next();
// }
/**
 * 
 *  `param` is the middleware is used to operate when there is a particular url requseted
 * 
 *  - in this case, this is `id`, 
 *  -   (val) => parameter is the parameter passed in the .param() function
 *  - in this case val ==> id  
 *  
*/

/**
 * 
 * Here checkID() function is used to reduce the redundency of the code used to check the validity
 * of the `id` requested by the user
 * 
*/


// ------------------------------------------------------------------
// ---------------------- check the user input ----------------------
exports.middleware = (req, res, next) => {

    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: "Missing name or price"
        })
    }

    next();
}
// ------------------------------------------------------------------


exports.getAllRoute = (req, res) => {

    // res.status(200).json({
    //     status: 'success',
    //     requestedAt: req.requestedTime,
    //     result: tours.length,
    //     data: {
    //         tours
    //     }
    // })
}

exports.getTour = (req, res) => {

    const id = req.params.id * 1;
    // const tour = tours.find(ele => ele.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })

}

exports.createTour = (req, res) => {

    // const newId = tours[tours.length - 1] + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    // tours.push(newTour);
    // writing in to the file
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: "SUCCESS",
    //         data: {
    //             tour: newTour
    //         }
    //     });
    // });
}

exports.updateTour = (req, res) => {

    res.status(200).json({
        status: "success",
        data: {
            tour: "<updated tour!....>"
        }
    })
}


exports.deleteTour = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: null
    })

}
