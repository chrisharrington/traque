app.directive("text", function() {
	return {
		restrict: "E",
		templateUrl: "directives/text.html",
		scope: {
			type: "@",
			placeholder: "@",
			name: "@",
			tab: "@tabindex",
			focus: "@",
			value: "&",
			ngModel: "=",
			bindings: "="
		},
		link: function(scope, element, attributes) {
			element.find("input").on("focus", function() {
				element.addClass("focus");
			});

			element.find("input").on("blur", function() {
				element.removeClass("focus");
			});
		}
	}
});