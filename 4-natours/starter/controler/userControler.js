const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

/*
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    // this will check for each element if there is a field which is passed in the `allowedFields[]`  
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) 
            newObj[el] = obj[el];
    })

    return newObj;
}
*/
exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
});

/*
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });

*/

exports.updateMe = catchAsync( async(req, res, next) => {

    // 1. create error if user POSTed password related data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new ( AppError('This route is not for password change. Please use the /updateMyPassword to update the password.', 400) ) 
        );
    }

    // we only want user to update name, email... not the role or reset token, or any other sensetive data
    // that is why we will first check the given details for the updation, after checking we will allow the updation process
    
    // 2. filtered out the unwanted field names that are not allowed to get updated
    const filteredBody = filterObj(req.body, 'name', 'email'); //for now we want only name and email
    
    // 3.  update user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true, // this will instruct the function to return the updated user
        runValidators: true, // before saving the user, validators will be run
    });
    
    res.status(200).json({
        status: 'success', 
        data: { 
            user: updatedUser  
        }
    })
})

exports.deleteMe = catchAsync( async (req, res) => {

    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null 
    })
})

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this is route is not yet defined'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this is route is not yet defined'
    })
}
exports.updateUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this is route is not yet defined'
    })
}
exports.createUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this is route is not yet defined'
    })
}

