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

	this.getUser = function(name) {
		$.ajax({
		    type: 'GET',
		    contentType: 'application/json',
		    url: '/user/' + name 
		}).done(function(user) {
	    	self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.updateUser = function(data) {
		$.ajax({
		    type: 'PUT',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/user'
		}).done(function(user) {
	    	self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.deleteUser = function(name) {
		$.ajax({
		    type: 'DELETE',
		    contentType: 'application/json',
		    url: '/user/' + name
		}).done(function(users) {
	    	that.getUsers();
	    }).fail(function(error){
	        console.log(error);
	    });
	}
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
		var winnerstand = [	{name: '', score: 0}, {name: '', score: 0}, {name: '', score: 0}];
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

	this.getUser = function(name) {
		data.getUser(name.name);
	};

	this.generateUser = function(user) {
		self.currentUser.splice(0, self.currentUser().length);
		self.currentUser.push(user);
		self.hideAllInMain();
		$('.user').show();
	};

	this.deleteUser = function() {
		data.deleteUser(self.currentUser()[0].name);
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

		var day = {};
		day.date = self.newUserDate();
		day.exercise = 0;
		day.healthyChoice = 0;
		day.satisfied = 0;
		day.score = 0;
		day.soda = false;
		day.sugar = false;

		for (var i = 0; i < self.currentUser()[0].day.length; i++) {
			if (self.currentUser()[0].day[i].date == day.date) {
				alert(day.date + ' already exists. Use another date.')
				return;
			}
		}
		self.currentUser()[0].day.push(day);
		self.currentUserDate.splice(0, self.currentUserDate().length);
		self.currentUserDate.push(self.currentUser()[0].day[self.currentUser()[0].day.length - 1]);
		self.hideAllInMain();
		$('.userDate').show();
	}

	this.deleteUserDate = function() {
		for (var i = 0; i < self.currentUser()[0].day.length; i++) {
			if (self.currentUser()[0].day[i].date == self.currentUserDate()[0].date) {
				self.currentUser()[0].day.splice(i, 1);
			}
		}
		self.updateUser();
	}

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
		self.updateUser();
	};

	this.updateUser = function() {
		self.updateUserScore();
		data.updateUser(self.currentUser()[0]);
	};

	this.updateUserScore = function() {
		self.currentUser()[0].totalScore = 0;
		for (var i = 0; i < self.currentUser()[0].day.length; i++) {
			var score = 0;
			score += self.currentUser()[0].day[i].exercise * 2;
			score += self.currentUser()[0].day[i].healthyChoice;
			score += self.currentUser()[0].day[i].satisfied;
			if (self.currentUser()[0].day[i].sugar) {
				score += 2;
			}
			if (self.currentUser()[0].day[i].soda) {
				score += 2;
			}
			if (self.currentUser()[0].day[i].exercise && self.currentUser()[0].day[i].sugar && self.currentUser()[0].day[i].soda && self.currentUser()[0].day[i].healthyChoice && self.currentUser()[0].day[i].satisfied) {
				score *= 2;
			}
			self.currentUser()[0].day[i].score = score;
			self.currentUser()[0].totalScore += score;
		}
	}

	data.getUsers(true);
};

ko.applyBindings(new ViewModel(Data));