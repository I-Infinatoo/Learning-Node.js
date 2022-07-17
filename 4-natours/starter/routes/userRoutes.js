const express = require('express');
const router = express.Router();

const userControler = require('./../controler/userControler');
const authControler = require('./../controler/authControler');

router.post('/sigup', authControler.signup);
router.post('/login', authControler.login);


router.post('/forgotPassword', authControler.forgotPassword);
router.patch('/resetPassword/:token', authControler.resetPassword);

router.patch('/updateMyPassword', authControler.protect, authControler.updatePassword);

router.patch('/updateMe', authControler.protect, userControler.updateMe);
router.delete('/deleteMe', authControler.protect, userControler.deleteMe);

router
    .route('/')
    .get(userControler.getAllUsers)
    .post(userControler.createUsers);

router
    .route('/:id')
    .get(userControler.getUser)
    .patch(userControler.updateUsers)
    .delete(userControler.deleteUser);

module.exports = router;
