var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
    name: String,
    totalScore: Number,
    day: [
    	{
    		date: String,
    		exercise: Number,
    		sugar: Boolean,
    		soda: Boolean,
    		healthyChoice: Number,
    		satisfied: Number,
    		score: Number
    	}
    ]
});

module.exports = mongoose.model('User', userSchema);