module.exports = new function() {
    this._registrants = {};
    
    this.on = function(key, registrant) {
        if (!key || !registrant)
            return;
        
        if (!this._registrants[key])
            this._registrants[key] = [];
        this._registrants[key].push(registrant);
    };
    
    this.emit = function(key, data) {
        if (!key || !this._registrants[key])
            return;
        
        this._registrants[key].forEach(function(registrant) {
            registrant(data); 
        });
    };
};