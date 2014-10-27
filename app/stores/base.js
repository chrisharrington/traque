var dispatcher = require("events/dispatcher"),
    emitter = require("events/emitter")
    config = require("config");

var _id = 100;

module.exports = function(constants, collection) {
    var me = this;
    
    this.all = function() {
        if (this._collection !== undefined)
            emitter.emit(constants.ALL, this._collection);
        else {
            $.getJSON(config.apiUrl + collection).then(function(models) {
                me._collection = models;
                emitter.emit(constants.ALL, models);
            }).fail(function(e) {
                emitter.emit(constants.ALL, e);
            });
        }
    };
    
    this.create = function(item) {
        $.post(config.apiUrl + collection, item).then(function() {
            item.id = _id++;
            me._collection.push(item);
            me.all();
            emitter.emit(constants.CREATE, item);
        });
    };
    
    dispatcher.register(function(payload) {
		switch (payload.type) {
			case constants.ALL:
				me.all();
				break;
            case constants.CREATE:
                me.create(payload.content);
                break;
		}
	});
};