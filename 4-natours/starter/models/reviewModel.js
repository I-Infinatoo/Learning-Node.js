// review:txt | rating:int | createdAt:Date | ref to tour | ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        require: [true, 'Please enter a review!'],
        trim: true
    },
    rating: {
        type: Number,
        require: [true, 'Rating is required for the review.'],
        min: 1,
        max: 5
    },
    createdAt: { 
        type: Date,
        default: Date.now() 
    },
    Tour: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            require: [true, 'Review must require Tour!']
        }
    ],
    User: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            require: [true, 'Review must require User!']
        }
    ] 
},
{   //it is used for the virtual property, to only push the specified fields only in the json file
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
    
    // this.populate({
    //     // populate for tour
    //     path: 'Tour',
    //     select: 'name'
    // }).populate({
    //     // populate for user
    //     path: 'User',
    //     select: 'name photo'
    // });
    this.populate({
        // populate for user
        path: 'User',
        select: 'name photo'
    });
    
    next();
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;