var Config = require("config"),
	
	emitter = require("dispatcher/emitter"),
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

app.factory("baseStore", function($timeout, $http) {
	return function(model, constants, url) {
		var me = this;

		this.all = function() {
			return new Promise(function(resolve, reject) {
				$timeout(function() {
					emitter.emit(constants.ALL, []);
				}, 250);
			});
		};

		this.update = function(content) {
			return new Promise(function(resolve) {
				$timeout(function() {
					emitter.emit(constants.UPDATE, content);
					resolve();
				}, 500);
			});
		};

		this.create = function(content) {
			return new Promise(function(resolve) {
				$timeout(function() {
					content.id = -1;
					emitter.emit(constants.CREATE, content);
					resolve();
				}, 500);
			});
		};

		this.remove = function(content) {
			return new Promise(function(resolve) {
				$timeout(function() {
					emitter.emit(constants.REMOVE, content);
					resolve();
				}, 500);
			});
		};

		dispatcher.register(function(payload) {
			switch (payload.type) {
				case constants.ALL:
					me.all();
					break;
				case constants.UPDATE:
					me.update(payload.content);
					break;
				case constants.CREATE:
					me.create(payload.content);
					break;
				case constants.REMOVE:
					me.remove(payload.content);
					break;
			}
		});
	}
});