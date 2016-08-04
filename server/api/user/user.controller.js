'use strict';

var User = require('./user.model');

function UserController() {}
UserController.prototype.getUsers = function(req, res) {

    return new Promise(function(resolve, reject) {
        User.find({}, function(error, users) {

            if (error) {
                reject(error);
            } else {
                resolve(users);
            }

        });

    }).then(function(users) {

        res.status(200).json(users);

    }).catch(function(error) {
        console.log(error);
    });

}

UserController.prototype.createUser = function(req, res) {
    User.create({
        name: req.body.name,
        totalScore: 0,
        day: [
        	{
        		date:req.body.date,
        		exercise: 0,
        		sugar: false,
        		soda: false,
        		healthyChoice: 0,
        		satisfied: 0,
        		score: 0
        	}
        ]
    }, function(error, user) {
        if (error) {
            console.log(error);
        } else {
            res.status(201).json(user);
        }
    });
}

UserController.prototype.getUser = function(req, res) {

	return new Promise(function(resolve, reject) {
        User.findOne({name: req.params.name}, function(error, user) {

            if (error) {
                reject(error);
            } else {
                resolve(user);
            }

        });

    }).then(function(user) {

        res.status(200).json(user);

    }).catch(function(error) {
        console.log(error);
    });
}

UserController.prototype.deleteUser = function(req, res) {

	return new Promise(function(resolve, reject) {
        User.findOneAndRemove({name: req.params.name}, function(error, user) {

            if (error) {
                reject(error);
            } else {
                resolve(user);
            }

        });

    }).then(function(user) {

        res.status(200).json(user);

    }).catch(function(error) {
        console.log(error);
    });
};

UserController.prototype.updateUser = function(req, res) {
	return new Promise(function(resolve, reject) {
        User.findOneAndUpdate({name: req.body.name}, {totalScore: req.body.totalScore, day: req.body.day}, {new: true}, function(error, user) {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }

        });

    }).then(function(user) {
        res.status(200).json(user);
    }).catch(function(error) {
        console.log(error);
    });
};



module.exports = UserController.prototype;