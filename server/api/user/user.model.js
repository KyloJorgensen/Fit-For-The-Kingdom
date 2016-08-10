var mongoose = require('mongoose');

var mongoose = require('mongoose');


var dateSchema = mongoose.Schema({
    user_id: String,
    date: String,
    exercise: Number,
    sugar: Boolean,
    soda: Boolean,
    healthyChoice: Number,
    satisfied: Number,
    score: Number
});

var userSchema = mongoose.Schema({
    name: String,
    totalScore: Number,
    day: [dateSchema]
});

module.exports = mongoose.model('User', userSchema);