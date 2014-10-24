var Utilities = require("utilities");

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
				if (!Utilities.hasClass(target[0], scope.trigger) && !Utilities.parentHasClass(target[0], scope.trigger))
					scope.$apply(function() {
						scope.visible = false;
					});
			});
		}
	}
});