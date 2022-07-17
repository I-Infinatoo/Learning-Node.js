const express = require('express')
const router = express.Router();

const reviewControler = require('../controler/reviewControler');
const authControler = require('./../controler/authControler');


// create review
router
    .route('/')
    .get(reviewControler.getAllReview)
    .post(authControler.protect, authControler.restrictTo('user'), reviewControler.createReview)

// delete review
router.route('/deleteReview/:id').delete(reviewControler.deleteReview);

module.exports = router;