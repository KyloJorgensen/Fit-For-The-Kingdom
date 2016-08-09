'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');


router.get('/', controller.getUsers)
    .post('/', controller.createUser)
    .put('/', controller.updateUser)
    .get('/:name', controller.getUser)
    .delete('/:name', controller.deleteUser)
    .put('/', controller.updateUser)

module.exports = router;