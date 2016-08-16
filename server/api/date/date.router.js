'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./date.controller');


router.get('/user/:userId', controller.getUserDates)
	.get('/date/:dateId', controller.getDate)
	.post('/', controller.createDate)
	.put('/', controller.updateDate)
	.delete('/', controller.deleteDate)
	.post('/updateDays', controller.updateDays)

module.exports = router;