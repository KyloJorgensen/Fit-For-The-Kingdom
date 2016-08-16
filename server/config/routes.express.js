var userRouter = require('../api/user/user.router'),
	mainRouter = require('../api/main/main.router'),
	dateRouter = require('../api/date/date.router');

module.exports = function(app) {
    app.use('/', mainRouter);
    app.use('/user', userRouter);
    app.use('/date', dateRouter);
};