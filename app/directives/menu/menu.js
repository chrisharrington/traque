app.directive("menu", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "directives/menu.html",
		scope: {
			trigger: "@",
			visible: "="
		},
		link: function(scope) {
			scope.name = "Chris Harrington";
			scope.email = "chrisharrington99@gmail.com";
			
			$rootScope.$on("documentClicked", function(inner, target) {
				if (!_hasClass(target[0], scope.trigger) && !_parentHasClass(target[0], scope.trigger))
					scope.$apply(function() {
						scope.visible = false;
					});
			});
		}
	}
	
	function _hasClass(element, className) {
		return _.contains(element.className.split(" "), className);
	}
	
	function _parentHasClass(element, className) {
		while (element.parentNode !== null) {
			if (_hasClass(element, className))
				return true;
			
			element = element.parentNode;
		}
		
		return false;
	}
});