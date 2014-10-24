module.exports = {
    hasClass: function(element, className) {
        return _.contains(element.className.split(" "), className);
    },
    
    parentHasClass: function(element, className) {
        while (element.parentNode !== null) {
			if (this.hasClass(element, className))
				return true;
			
			element = element.parentNode;
		}
		
		return false;
    },
    
    hasClasses: function(element, classes) {
        var me = this;
        return _.every(classes, function(className) {
            return me.hasClass(element, className);
        });
    },
    
    parentHasClasses: function(element, classes) {
        var me = this;
        return _.every(classes, function(className) {
            return me.parentHasClass(element, className); 
        });
    }
};