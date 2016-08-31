'use strict';
var Date = require('../date/date.model'),
    User = require('./user.model'),
    bcrypt = require('bcryptjs');

function UserController() {};

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
        res.status(500).json(error);
    });
};

UserController.prototype.getUser = function(req, res) {
    return new Promise(function(resolve, reject) {
        User.findOne({
            _id: req.params.userId
        }, function(error, user) {
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
        res.status(500).json(error);
    });
};

UserController.prototype.createUser = function(req, res) {
    return new Promise(function(resolve, reject) {
        User.create({
            name: req.body.name, 
            totalScore: 0
        }, function(error, user) {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    }).then(function(user) {
        res.status(201).json(user);
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({error: error});
    });
};

UserController.prototype.deleteUser = function(req, res) {
	return new Promise(function(resolve, reject) {
        User.findOneAndRemove({_id: req.params.userId}, function(error, user) {
            if (error) {
                reject(error);
            } else {
                return new Promise(function(resolve, reject) {
                    Date.find({_author: req.params.userId}).remove(function(error, dates){
                        if (error) {
                            reject(error);
                        } else {
                            resolve(dates);
                        }
                    });
                }).then(function(dates) {
                    resolve(user);
                }).catch(function(error) {
                    reject(error);
                });
            }
        });
    }).then(function(user) {
        res.status(200).json(user);
    }).catch(function(error) {
        console.log(error);
        res.status(500).json(error);
    });
};

module.exports = UserController.prototype;