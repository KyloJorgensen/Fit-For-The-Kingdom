'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    totalScore: Number,
    dates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Date'
    }]
});

module.exports = mongoose.model('User', userSchema);