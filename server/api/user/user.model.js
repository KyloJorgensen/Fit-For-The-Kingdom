'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: {
		type: String
	},
	password: {
        type: String
    },
    name: String,
    totalScore: Number,
    publicStatus: Boolean,
    dates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Date'
    }]
});

module.exports = mongoose.model('User', userSchema);