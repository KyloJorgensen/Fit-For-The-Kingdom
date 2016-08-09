'use strict';

var express = require('express'),
	app = express(),
	path = require('path'),
    variables = require('./config/variables.express'),
    mainRouter = require('./api/main/main.router'),
    userRouter = require('./api/user/user.router');

require('./config/mongoose.connection');
require('./config/config.express')(app);
require('./config/routes.express')(app);

app.listen(variables.EXPRESS_PORT, function () {
    console.log(variables.EXPRESS_LISTEN_MESSAGE + variables.EXPRESS_PORT);
});

exports.app = app;