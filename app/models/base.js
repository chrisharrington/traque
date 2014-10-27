module.exports = function(params) {
    params = params || {};
    _.extend(this, params);
    
    this.validate = params.validate || function() {
        return true;
    };
}