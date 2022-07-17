const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name , email, photo, passwd, passwd_confirm
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true, 'Please tell us your name!'],
        trim: true,
        // unique: true,
        // maxlength: [15, 'A user name must have less or equal then 40 characters'],
        // minlength: [5, 'A user name must have more or equal then 10 characters']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide your email'],
        lowercase: true,

        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        //this will store the path of plae in the file system where the image is stored
        type: String
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'guide', 'lead-guide', 'admin'],
    //     default: 'user'
    // },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'Password is required!'],
        minlength: 8,

        select: false
        //in future we will use a validator for passwd strength check
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Password confirmation is required!'],

        //in future we will use validators to confirm the password

        validate: {
            //This only works on CREATE and SAVE!!
            validator: function (curElement) {
                return curElement === this.password; //abc===abc
            },

            message: 'Passwords are not the same!!'
        }
    },
    // passwordChangedAt: {
    //     type: Date
    // }

    passwordChangedAt: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    // when useing delete cur account
    active: {
        type: Boolean,
        default: true,

        select: false
    }

});

userSchema.pre('save', async function (next) {

    //this function will run when the user modifies the password field

    // if user has not modified the password
    if (!this.isModified('password')) return next();

    // else

    // hash the password with the cost of 12
    //cost ==> how much CPU intensity would be required to generate hash
    this.password = await bcrypt.hash(this.password, 12);
    // delete the passwordConfirm for the DB
    this.passwordConfirm = undefined;

    next();
});


userSchema.pre(/^find/, function(next) {  // apply this query to every middleware that starts with `find`
    // this points to the current query
    this.find({ active: { $ne: false } });  // find the object with active field not equals to false
    next();
})


// this will run right before a new document is saved
userSchema.pre('save', function(next) {

    // if the password is not modefied before or the document is new then run the next middleware
    if(!this.isModified('password') || this.isNew) return next();

    // 1000ms = 1sec is subtracted from the timestamp because sometime it can happen that 
    // the token could get generated before the timestamp updation and this case will lead to fail the password reset middleware
    // as we phave compared the current time with the reset token
    this.passwordChangedAt = Date.now()-1000;
    next();
})


userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//     // JWTTimestamp -> when the tokem was issued

//     if (this.passwordChangedAt) {
//         // if anytime the user changed password after signup

//         const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

//         console.log(changedTimeStamp, JWTTimestamp);

//         return JWTTimestamp < changedTimeStamp;
//     }

//     return false;
// }


// i dont know what is wrong with the above function, why it is not running desirabely ... 
// the below function is the copy form the original file 
// i will check for the differences between these functions!!

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    // JWTTimestamp -> when the tokem was issued
    if (this.passwordChangedAt) {
        // if anytime the user changed password after signup
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function (email) {
    const resetToken = crypto
        .randomBytes(32)
        .toString('hex');

    // encrypt the reset token

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //to add 10 mins in milliseconds

    // returning the plain text token so that user can get it and use it
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;