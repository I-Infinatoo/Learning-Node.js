const crypto = require('crypto')
const { promisify } = require('util');
const jwt = require('jsonwebtoken'); 
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);


    // in this way cookie will only be sent in the production env using https, else normally
    const cookieOptions = {
            // current time + this much time in milliseconds
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;  // cookie will only be sent using secure connection

                //name, value, options for cookie
    res.cookie('jwt', token, cookieOptions);

    // remove the password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {

    // User.create() --> will create the new user with the data user has sent
    // here we are only using these fields (from the data sent by the user) to create a new user

    // const newUser = await User.create(req.body);
    // in the above method, user can directlky enter the field in the body by marking itself as an admin
    // this will lead to compromise the system's security

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    createSendToken(newUser, 201, res);

    // const token = signToken(newUser._id);

    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: newUser
    //     }
    // })
});


exports.login = catchAsync(async (req, res, next) => {

    //destructuring
    // it is equivalent to: `const email = req.body.email` and `const password = req.body.password`
    const { email, password } = req.body;

    // 1. check if email and password exists
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 404))
    }
    // 2. check if user exists and password is correct

    // this will find the email and password form the db 
    // `select('+password')` is used because password is set to `select:false` in the schema
    // so that it cannot be visible to anyone when asking for all users details
    const user = await User.findOne({ email }).select('+password');

    // correctPassword is an instance method which check whether the given password by the user is equal to the stored password in DB 
    // const correct = await user.correctPassword(password, user.password);

    // if either the email entered is not matching with any user or the password or the both 

    // if (!user || !correct) {
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect Email or Password!', 401))
    }

    // 3. if everything OK, send token to client
    createSendToken(user, 200, res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
});

exports.protect = catchAsync(async (req, res, next) => {

    // 1. getting token and check if its there?

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);

    if (!token) {
        return next(new AppError('You are not logged in! Please login to get the access', 401));
    }

    // 2. verification token
    // the function will verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token is no longer exist.', 401));
    }

    // 4. check if user changed password after the token has issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('Use recently changed the password! Please login again.'), 401);
    }

    // pass the userdata to the req.user so that the data can be traveled throughout the middlewares for further use
    req.user = currentUser;
    // grant access to the route
    next();
})

exports.restrictTo = (...roles) => {
    // ...roles ===> these are the received roles from the function call    
    return (req, res, next) => {
        // in this case: roles ['admin', 'lead-guide']  role='user' 
        if (!roles.includes(req.user.role)) {
            // here we are able to use `req` to get the role because `protect()` method placed the `freshUser` in to the `req.user`
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }

        next();
    }
}

// it will only receive the email address
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. get the POSTed email from the user
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new AppError('User does not exists.', 404)
        );
    }
    // 2. generate the random reset token
    const resetToken = user.createPasswordResetToken();

    // this is used so that, `passwordResetExpires` which is used in the function is not saved in the DB in the function
    // therefore we save the details here, along with some extra passing things

    // `validateBeforeSave` ==> this will tell the mongoose to ignore the required fields
    await user.save({ validateBeforeSave: false });

    // 3. send it to the user's email

    // this is the hard coded url ...which we will send to the user through email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and the passwordConfirm to: ${resetURL} .
    \nIf not done by you then you can ignore this message!`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (Valid for only 10 mins)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Reset token sent to email!'
        })
    }
    catch (err) {

        // there is an error while sending an email rest is working fine ..the token generation and reset

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending an email. Try again later!', 500)
        )
    }
});

// it will receive the token and the password
exports.resetPassword = catchAsync(async (req, res, next) => {

    // 1. Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // query the database for this token ::: look for the match of `hashedToken` and `passwordResetToken`
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() } // also check whether the token has expired or not i.e. 
        // `passwordResetExpires` must be less than the current time stamp of the server
    })

    // 2. If token has not expired, and there is a user set the new password
    if (!user) {
        return next(
            new AppError('Token is invalid or has expired!', 400)
        );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    // in this case we dont want to turn off the validators, as the validators would be required to check for the new fields
    await user.save();
    
    // 3. update changePasswordAt property for the user
        // this is done by in the userModel by a preSave function
        // to update the changePasswordAt property in the DB

    // 4. Log the user in, send JWT
    
    createSendToken(user, 200, res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
});

/*
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});
*/

exports.updatePassword = catchAsync( async (req, res, next) => {
    
    // 1. Get user from the collection
    const user = await User.findById(req.user.id).select('+password');   

    // 2. Check if posted current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Incorrect current Password!', 401))
    }

    // 3. If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. log user in, send JWT
    createSendToken(user, 200, res);
    // const token = signToken(user._id);
    // res.status(200).json({ 
        // status: 'success',
        // token
    // });
})
