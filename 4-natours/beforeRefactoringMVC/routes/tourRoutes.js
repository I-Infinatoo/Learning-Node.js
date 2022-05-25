const express = require('express');
const tourControler = require('./../controler/tourControler');

/**
 * 
 *  router is loacal to this file only, any changes in other file's router variable will not
 *  directly affect this router
 * 
 */
const router = express.Router();

// router.param('id', tourControler.checkID);

/**
 *  `checkID` will send the response to the client if there is no such id present as requested
 *  else it will not interfere in the normal flow of the program
*/


router
    .route('/')
    .get(tourControler.getAllRoute)
    .post(tourControler.middleware, tourControler.createTour);
//  middleware() function will check the input, it is a middleware

router
    .route('/:id')
    .get(tourControler.getTour)
    .patch(tourControler.updateTour)
    .delete(tourControler.deleteTour);

module.exports = router;