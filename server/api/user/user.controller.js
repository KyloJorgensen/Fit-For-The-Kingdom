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

UserController.prototype.addUandP = function(req, res) {
    return new Promise(function(resolve, reject) {
        User.find({}, function(error, users) {
            if (error) {
                reject(error);
            } else {
                resolve(users);
            }
        });
    }).then(function(users) {
        var newUsers = [];
        // console.log(users);
        for (var i = 0; i < users.length; i++) {
            // console.log(users[i] || 'error');
            var user = users[i];
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    console.log({
                        message: 'Internal server error'
                    });
                }
                bcrypt.hash(user.name, salt, function(err, hash) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    }

                    User.findOneAndUpdate({
                        _id: user._id
                    }, {
                        $set: {
                            username: user.name,
                            password: hash,
                            publicStatus: true
                        }
                    }, function(err, newuser) {
                        if (err) {
                            console.log(err);
                        }
                        newUsers.push(newuser);
                    });

                    console.log(user, hash);
                });
            });         
        }
        res.status(200).json(newUsers);
    }).catch(function(error) {
        res.status(500).json(error);
    });
};

module.exports = UserController.prototype;