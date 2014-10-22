app.directive("profileImage", function($rootScope, md5) {
	return {
		restrict: "E",
		templateUrl: "directives/profileImage.html",
		scope: {
			email: "=",
			size: "@",
			id: "="
		},
		link: function(scope, element, attributes) {
			scope.location = "http://gravatar.com/avatar/" + md5.createHash(scope.email) + "?s=" + (scope.size || 35) + "&d=mm";
		}
	}
});