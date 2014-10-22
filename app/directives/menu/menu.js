app.directive("menu", function() {
	return {
		restrict: "E",
		templateUrl: "directives/menu.html",
		link: function(scope) {
			scope.name = "Chris Harrington";
			scope.email = "chrisharrington99@gmail.com";
		}
	}
});