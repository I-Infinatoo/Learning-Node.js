// const express = require('express');
// const fs = require('fs');
// const { features } = require('process');

// // it will call the finctions of the express module  
// const app = express();



// // middleware : that acn modify the incoming response data
// // used for `post` method
// //  the middle ware is used to parse the request sent by the client to the server using 'POST' method.
// app.use(express.json());


// /*
// // if there is a call made on the home page with get request
// app.get('/', (req, res) => {

//     // the response will be sent back to the client upon it's request
//     // status is for the http header carried by the response '200' is for the success
//     // res.status(200).send('Hello from the server side!');

//     // we can also send JSON file in the response
//     res.status(200).json({ message: 'Hello from the server side!', app: 'natours' });
// });

// app.post('/', (req, res) => {

//     res.send('Hello from the server side(POST)!');

// });
// */



// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );


// // this is also called 'route handler'
// app.get('/api/v1/tours', (req, res) => {

//     res.status(200).json({
//         status: 'success',
//         result: tours.length,
//         data: {
//             tours
//         }
//     })

// })

// // this api will get the data as a input form the user
// app.post('/api/v1/tours', (req, res) => {

//     // console.log(req.body);

//     // to get the request saved in to the file or the data base:
//     const newId = tours[tours.length - 1] + 1;
//     const newTour = Object.assign({ id: newId }, req.body);
//     tours.push(newTour);
//     // writing in to the file
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: "SUCCESS",
//             data: {
//                 tour: newTour
//             }
//         });
//     });

//     /** 
//      * 
//      * The above section will 
//      * 1. get the number of tours(data entry) resent currently in the data set(JSON) file
//      * 
//      * 2. then assign a newTour variable with the value of the new id and the req body ( data sent by the client in the form of request)
//      * 
//      * 3. finally push the newly created object into the the tours data set(JSON) file
//      * 
//      * 4. overwrite the existing file with the new file in the directory, and then send the res back to the client about the updates performed
//     */



//     // to complete the request responce cycle .... we need to send something back to the client always 
//     // res.send('DONE!');
// });


// // :id is the `id` of the tour that sould be updated, id is passed by the client
// app.patch('/api/v1/tours/:id', (req, res) => {


//     // converting the `id` received from the client to the integer for the comparison
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid Id"
//         })
//     }

//     //if the `id` received is valid 
//     // here in this case only dummy message is sent back to the client 
//     // i order to reduce the amount of work....
//     //  as to update the values, we required to get the data from the file and then update that data
//     // then push back to the file and save the file
//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: "<updated tour!....>"
//         }
//     })
// });



// app.delete('/api/v1/tours/:id', (req, res) => {


//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID"
//         });
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })

// });

// // open the service to the port
// const port = 3000;
// app.listen(port, () => {
//     console.log(`running on ${port} ... `);
// });



//------------------------------------------------------------------------
//----------------------- Refactoring of CODE ----------------------------
//------------------------------------------------------------------------



// const express = require('express');
// const fs = require('fs');
// const { features } = require('process');
// const morgan = require('morgan');

// const app = express();
// /**
//  * expressjs.com  ==> for the reference
// */

// // ------------------------------- 1. middlewares-----------------------------

// app.use(morgan('dev'));
// /**
//  *  `morgan('dev')` --> will display some additional data on the console like:
//  *      1. HTTP method used to send the request
//  *      2. route at which request was made
//  *      3. status code sent back by the server 
//  *      4. response time in (ms)
//  *      5. response size 
// */

// /**
//  *  `morgan('tiny')` --> it is similar to the 'dev' argument, but the difference 
//  *  is in the display order and the status code is color less
// */

// app.use(express.json());

// /** 
//  * 
//  * here in the above case `express.json()` is calling a function ...
//  * and that function is placed in the stack of the middleware
//  * 
// */

// /** 
//  * 
//  * user defined middleware
//  * `next` passed here as the 3rd argument is the next() function
//  * and this is used to call the next middleware function
//  * 
//  * If next() function is not called inside the user defined middleware
//  * then in that case the middleware call lineup (`request response cycle`) will get stuck at that place
//  * 
// */


// /**
//  * 
//  * Custom middle ware is defind at the top ..before any route handler
//  * because, once route handler is called it will terminate the `request response cycle`
//  * and the control will never be passed to the custom middleware placed after the route handler
//  * 
// */

// app.use((req, res, next) => {
//     console.log("Hello from the middleware!");
//     next();
// });


// /**
//  * 
//  * now creating a middleware which will get the request time ...and further we will send back the time in the json file 
//  * as the response to the request
//  * 
// */
// app.use((req, res, next) => {
//     req.requestedTime = new Date().toISOString();
//     next();
// });


// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );


// // -------------------- 2. route handlers -------------------------------

// const getAllRoute = (req, res) => {

//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestedTime,
//         result: tours.length,
//         data: {
//             tours
//         }
//     })
// }

// const getTour = (req, res) => {

//     const id = req.params.id * 1;
//     const tour = tours.find(ele => ele.id === id);

//     if (!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         })
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     })

// }

// const createTour = (req, res) => {

//     const newId = tours[tours.length - 1] + 1;
//     const newTour = Object.assign({ id: newId }, req.body);
//     tours.push(newTour);
//     // writing in to the file
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: "SUCCESS",
//             data: {
//                 tour: newTour
//             }
//         });
//     });
// }

// const updateTour = (req, res) => {

//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid Id"
//         })
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: "<updated tour!....>"
//         }
//     })
// }


// const deleteTour = (req, res) => {

//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID"
//         });
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })

// }


// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'this is route is not yet defined'
//     })
// }

// const getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'this is route is not yet defined'
//     })
// }
// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'this is route is not yet defined'
//     })
// }
// const updateUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'this is route is not yet defined'
//     })
// }
// const createUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'this is route is not yet defined'
//     })
// }

// // app.get('/api/v1/tours', getAllRoute);
// // app.get('/api/v1/tours/:id', getTour);
// // app.post('/api/v1/tours', createTour);
// // app.patch('/api/v1/tours/:id', updateTour);
// // app.delete('/api/v1/tours/:id', deleteTour);

// //-------------- we can do this like : ----------------------------------//

// // const requestLink = '/api/v1/tours/';

// // app.get(requestLink, getAllRoute);
// // app.get(requestLink + ':id', getTour);
// // app.post(requestLink, createTour);
// // app.patch(requestLink + ':id', updateTour);
// // app.delete(requestLink + ':id', deleteTour);

// //--------------- even iin a more better way: ---------------------------//


// // app.get(requestLink, getAllRoute);
// // app.post(requestLink, createTour);
// // app.get(requestLink + ':id', getTour);
// // app.patch(requestLink + ':id', updateTour);
// // app.delete(requestLink + ':id', deleteTour);


// // -------------------------- 3. route ----------------------------------

// app.route('/api/v1/tours/').get(getAllRoute).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUsers);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUsers).delete(deleteUser);

// /**
//  * 
//  * In the above lines `.route()` will contain the address link for the service
//  * and the services with the same link to work upon ... can be used with the route method
//  * 
//  */


// // -------------------------- 4. start the server ------------------------
// const port = 3000;
// app.listen(port, () => {
//     console.log(`running on ${port} ... `);
// });



// ----------------------------------------------------------------------------    
// --------------------- A better file structure ------------------------------    
// ----------------------------------------------------------------------------    

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes'); 

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controler/errorControler');

const app = express();

/**
 * expressjs.com  ==> for the reference
*/

// ------------------------------- 1. Global middlewares----------------------------

// set security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));
    /**
     *  `morgan('dev')` --> will display some additional data on the console like:
     *      1. HTTP method used to send the request
     *      2. route at which request was made
     *      3. status code sent back by the server 
     *      4. response time in (ms)
     *      5. response size 
     */

    /**
     *  `morgan('tiny')` --> it is similar to the 'dev' argument, but the difference 
     *  is in the display order and the status code is color less
     */
}

// limit requests from the same API
const limiter = rateLimit({
    max: 100,   //maximum 100 req.
    windowMs: 60*60*1000,   //in 1hr (in miliseconds)
    message: 'Too many requests from this IP, Plaese try again in an hour!'
})

app.use('/api', limiter);   // rate limiter middleware will only be applied on the `/api` route


// Body parser, reading data form body into req.body
app.use(express.json({ limit: '10kb' }));   // this will limit the amount of data that can be read provided by the user
// app.use(express.json());
/** 
 * 
 * here in the above case `express.json()` is calling a function ...
 * and that function is placed in the stack of the middleware
 * 
*/


// data sanitization against NoSQL query injection
    // filter out all of the `$` and `.` from the params, body of the request
app.use(mongoSanitize());

// data sanitization against XSS attacks
    // clean any user inut element from the malicious HTML code
    // convert the html tags to non-functioning symbol
app.use(xss());


// prevent parameter pollution
    // allows duplicate paraeters of whitelist 
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));



// serving static files 
app.use(express.static(`${__dirname}/public`))
/**
 * This is used to route to anything available in the public directory
*/

// test middleware
app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();

    // checking for the headers user has sent
    // console.log(req.headers);
    next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {

    // const err = new Error(`Could not found the ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404

    next(new AppError(`Could not found the ${req.originalUrl} on this server!`, 404));
    //err will directly passed to the global handler after skippink all the middlewares present
    //in the stack
});

app.use(globalErrorHandler);

module.exports = app;
/**
 * 
 *  by exporting the `app` module, we are using it in the `server.js` file as
 *  in there we are starting listen to the server at the specific port
 *  
*/