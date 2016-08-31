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
        console.log(users);
        var user = {};
        for (var i = 0; i < users.length; i++) {
            var obj = users[i];
            if (!obj.publicStatus) {
                console.log('here');
                user = obj;
            } else {
                console.log('there');
            }
        }
        console.log(user);
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
                    res.status(200).json(newuser);
                });
            });
        });         
    }).catch(function(error) {
        res.status(500).json(error);
    });
};

module.exports = UserController.prototype;