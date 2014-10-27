app.directive("modal", function($rootScope, $timeout) {
	return {
		restrict: "E",
		templateUrl: "directives/modal.html",
		transclude: true,
		scope: {
			visible: "=",
			title: "@",
			loading: "=",
			ok: "=",
			cancel: "=",
			bindings: "="
		},
		link: function(scope, element, attributes) {
			scope.close = function() {
				scope.visible = false;
				if (scope.cancel !== undefined)
					scope.cancel();
			};

			$rootScope.$on("escapePressed", function() {
				scope.$apply(function() {
					if (scope.visible === true) {
						scope.close();
					}
				});
			});
		}
	};
});