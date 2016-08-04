'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
module.exports = function(app) {

   app.set('root', path.join(__dirname , "../.."));
   app.use(bodyParser.json());
   app.use('/public', express.static(app.get('root') +  '/client'));
   app.use('/libs', express.static(app.get('root') + '/node_modules'));

};