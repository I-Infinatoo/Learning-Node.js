const express = require('express');
const router = express.Router();

const userControler = require('./../controler/userControler');

router.route('/').get(userControler.getAllUsers).post(userControler.createUsers);
router.route('/:id').get(userControler.getUser).patch(userControler.updateUsers).delete(userControler.deleteUser);

module.exports = router;
