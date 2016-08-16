'use strict';

var Data = function(self) {
	var that = this;

	this.getUsers = function() {
		$.ajax({
	        url: '/user',
	        datatype: 'jsonp',
	        type: 'GET'
	    }).done(function(users) {
			self.updateUsers(users);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.addUser = function(name, date) {
		var data = {};
		data.name = name;
		data.date = date;

		$.ajax({
		    type: 'POST',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/user'
		}).done(function(user) {
	    	self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.getUser = function(userId) {
		$.ajax({
		    type: 'GET',
		    contentType: 'application/json',
		    url: '/user/' + userId 
		}).done(function(user) {
	    	self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.getUserDates = function(user) {
		$.ajax({
		    type: 'GET',
		    contentType: 'application/json',
		    url: '/date/user/' + user._id 
		}).done(function(date) {
	    	self.generateUserDates(date);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.createDate = function(userId, date) {
		var data = {};
		data.userId = userId;
		data.date = date;
		$.ajax({
		    type: 'POST',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/date' 
		}).done(function(date) {
			self.editDate(date);
	    }).fail(function(error){
	    	if (error.readyState == 4) {
	    		alert(error.responseText);
	    	} else {
	    		console.log(error);
	    	}
	    });
	};

	this.updateDate = function(date) {
		$.ajax({
		    type: 'PUT',
		    data: JSON.stringify(date),
		    contentType: 'application/json',
		    url: '/date'
		}).done(function(user) {
			self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.deleteUser = function(userId) {
		$.ajax({
		    type: 'DELETE',
		    contentType: 'application/json',
		    url: '/user/' + userId
		}).done(function(users) {
	    	that.getUsers();
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.deleteUserDate = function(userId, dateId) {
		var data = {};
		data.dateId = dateId;
		data._author = userId;

		$.ajax({
		    type: 'DELETE',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/date'
		}).done(function(user) {
			console.log(user);
			self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};


	this.updateDays = function(date) {
		$.ajax({
		    type: 'POST',
		    data: JSON.stringify(date),
		    contentType: 'application/json',
		    url: '/date/updateDays' 
		}).done(function(date) {
			console.log(date);
	    }).fail(function(error) {
    		console.log(error);
	    });
	};
};

var ViewModel = function(Data) {
	var self = this,
		data = new Data(self);

	this.users = ko.observableArray([]); 

	this.getUsers = function() {
		data.getUsers();
	};

	this.updateUsers = function(users) {
		self.users.splice(0, self.users().length);
		for (var i = 0; i < users.length; i++) {
			self.users.push(users[i]);
		}
		self.updatewinnerStand();
		self.hideAllInMain();
		$('.users').show();
	};

	this.winnerstand = ko.observableArray([]);

	this.updatewinnerStand = function() {
		var winnerstand = [	{name: 'none', score: 0}, {name: 'none', score: 0}, {name: 'none', score: 0}];
		for (var i = 0; i < self.users().length; i++) {
			if (self.users()[i].totalScore >= winnerstand[0].score) {
				winnerstand[2].name = winnerstand[1].name;
				winnerstand[2].score = winnerstand[1].score;
				winnerstand[1].name = winnerstand[0].name;
				winnerstand[1].score = winnerstand[0].score;
				winnerstand[0].name = self.users()[i].name;
				winnerstand[0].score = self.users()[i].totalScore;
			} else if (self.users()[i].totalScore >= winnerstand[1].score) {
				winnerstand[2].name = winnerstand[1].name;
				winnerstand[2].score = winnerstand[1].score;
				winnerstand[1].name = self.users()[i].name;
				winnerstand[1].score = self.users()[i].totalScore;
			} else if (self.users()[i].totalScore >= winnerstand[2].score) {
				winnerstand[2].name = self.users()[i].name;
				winnerstand[2].score = self.users()[i].totalScore;
			}
		}

		self.winnerstand.splice(0, self.winnerstand().length);
		for (var i = 0; i < winnerstand.length; i++) {
			self.winnerstand.push(winnerstand[i]);
		}
	};

	this.hideAllInMain = function() {
		$('.toggle').hide();
	};

	this.newUser = function() {
		self.hideAllInMain();
		$('.newUser').show();
	};

	this.newUserName = ko.observable();

	this.addNewUser = function() {
		event.preventDefault();
		if (self.validateNewUserName(self.newUserName())) {
			self.newUserName('');
		};

	};

	this.validateNewUserName = function(name) {
		if (name) {
			data.addUser(name, self.formattedDate());	
			return true;
		}
		return false;
	};

	this.currentUser = ko.observableArray([]);
	this.currentDates = ko.observableArray([]);

	this.getUser = function(user) {
		data.getUser(user._id);
	};

	this.generateUser = function(user) {
		self.currentUser.splice(0, self.currentUser().length);
		self.currentUser.push(user);
		data.getUserDates(user);
		self.hideAllInMain();
		$('.user').show();
	};

	this.generateUserDates = function(dates) {
		self.currentDates.splice(0, self.currentDates().length);
		for (var i = 0; i < dates.length; i++) {
			self.currentDates.push(dates[i]);
		}
	};

	this.deleteUser = function() {
		data.deleteUser(self.currentUser()[0]._id);
	};

	this.currentUserDate = ko.observableArray([]);
	this.date = ko.observable('11/11/2011');

	this.editDate = function(user) {
		self.hideAllInMain();
		$('.userDate').show();
		self.currentUserDate.splice(0, self.currentUserDate().length);
		self.currentUserDate.push(user);
	};

	this.formattedDate = function() {
	    var d = new Date(Date.now()),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	};

	this.newUserDate = ko.observable(self.formattedDate());

	this.veiwAddNewUserDate = function() {
		self.hideAllInMain();
		$('.newUserDate').show();
	};

	this.addNewUserDate = function() {
		data.createDate(self.currentUser()[0]._id, self.newUserDate());
	};

	this.deleteUserDate = function() {
		var date = self.currentUserDate()[0];

		data.deleteUserDate(date._author, date._id);
	};

	this.validateDateInputs = function() {
		event.preventDefault();

		self.currentUserDate()[0].exercise = Number(self.currentUserDate()[0].exercise);
		if (!(self.currentUserDate()[0].exercise >= 0 && typeof self.currentUserDate()[0].exercise === 'number')) {
			alert('exercise needs to be a number equal to or above 0');
			return;
		}

		self.currentUserDate()[0].healthyChoice = Number(self.currentUserDate()[0].healthyChoice);
		if (!(self.currentUserDate()[0].healthyChoice >= 0 && typeof self.currentUserDate()[0].healthyChoice === 'number')) {
			alert('healthyChoice needs to be a number above 0');
			return;
		}

		self.currentUserDate()[0].satisfied = Number(self.currentUserDate()[0].satisfied);
		if (!(self.currentUserDate()[0].satisfied >= 0 && self.currentUserDate()[0].satisfied <= 3 && typeof self.currentUserDate()[0].satisfied === 'number')) {
			alert('satisfied needs to be a number between 0 and 3');
			return;
		}

		if (self.currentUserDate()[0].soda == "true" || self.currentUserDate()[0].soda == true) {
			self.currentUserDate()[0].soda = true;
		} else if (self.currentUserDate()[0].soda == "false" || self.currentUserDate()[0].soda == false) {
			self.currentUserDate()[0].soda = false;
		} else {
			alert('soda needs to be true or false');
			return;
		}

		if (self.currentUserDate()[0].sugar == "true" || self.currentUserDate()[0].sugar == true) {
			self.currentUserDate()[0].sugar = true;
		} else if (self.currentUserDate()[0].sugar == "false" || self.currentUserDate()[0].sugar == false) {
			self.currentUserDate()[0].sugar = false;
		} else {
			alert('sugar needs to be true or false');
			return;
		}
		data.updateDate(self.currentUserDate()[0]);
	};

	this.clickedSugar = function() {
		var currentDate = self.currentUserDate()[0];
		if (currentDate.sugar) {
			currentDate.sugar = false;
		} else {
			currentDate.sugar = true;
		}
		self.currentUserDate.splice(0, self.currentUser().length);
		self.currentUserDate.push(currentDate);
	};
	
	this.clickedSoda = function(thing) {
		var currentDate = self.currentUserDate()[0];
		if (currentDate.soda) {
			currentDate.soda = false;
		} else {
			currentDate.soda = true;
		}
		self.currentUserDate.splice(0, self.currentUser().length);
		self.currentUserDate.push(currentDate);
	};

	this.updateDays = function() {		// console.log(self.users());
		var users = self.users();
		for (var i = 0; i < users.length; i++) {
			var userId = users[i]._id;
			// console.log(users[i]);
			for (var h = 0; h < users[i].day.length; h++) {
				// console.log(users[i].day[h]);
				var date = {};
				date._author = userId;
				date.date = users[i].day[h].date;
				date.exercise = users[i].day[h].exercise;
				date.sugar = users[i].day[h].sugar;
				date.soda = users[i].day[h].soda;
				date.healthyChoice = users[i].day[h].healthyChoice;
				date.satisfied = users[i].day[h].satisfied;
				date.score = 0;
				console.log('date data:', date);
				data.updateDays(date);
			}
		}
	};

	data.getUsers(true);
};

ko.applyBindings(new ViewModel(Data));