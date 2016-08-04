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

// router.get('/:name', function(req, res) {
// 	for (var i = 0; i < users.length; i++) {
// 		console.log(users[i].name);
// 		console.log(req.params);
// 		if (users[i].name == req.params.name) {
			
// 			res.json(users[i]);
// 			return;
// 		}
//  	}
// });
