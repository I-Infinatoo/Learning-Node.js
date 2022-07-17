const express = require('express');
const tourControler = require('./../controler/tourControler');
const authControler = require('./../controler/authControler');


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

/**
 * 
 *  this route is calling the same getAllTour route, but before that 
 * `aliasTopTour` middleware is setting the parameters 
 * 
 */
router.route('/top-5-cheap').get(tourControler.aliasTopTour, tourControler.getAllRoute)

router.route('/tour-stats').get(tourControler.getTourStats)
router.route('/monthly-plan/:year').get(tourControler.getMonthlyPlan)

router
    .route('/')
    .get(authControler.protect, tourControler.getAllRoute)
    .post(tourControler.createTour);
//  middleware() function will check the input, it is a middleware

router
    .route('/:id')
    .get(tourControler.getTour)
    .patch(tourControler.updateTour)
    .delete(
        authControler.protect,
        authControler.restrictTo('admin', 'lead-guide'),
        // these roles are allowed to interact with the deleteTour resource 
        tourControler.deleteTour);

module.exports = router;