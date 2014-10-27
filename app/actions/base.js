module.exports = function(constants) {
	this.all = function() {
		return {
			type: constants.ALL
		};
	};
	
	this.create = function(content) {
		return {
			type: constants.CREATE,
			content: content
		};
	};
};