var Utilities = require("utilities");

app.directive("dropdown", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "directives/dropdown.html",
        scope: {
            placeholder: "@",
            list: "=",
            property: "@"
        },
        link: function(scope) {
            scope.listVisible = false;
            scope.isPlaceholder = true;
            scope.selected = scope.placeholder;
            
            scope.select = function(item) {
                scope.isPlaceholder = false;
                scope.selected = scope.property !== undefined ? item[scope.property] : item;
            }
            
            $rootScope.$on("documentClicked", function(inner, target) {
                var classes = ["dropdown-display", "clicked"];
				if (!Utilities.hasClasses(target[0], classes) && !Utilities.parentHasClasses(target[0], classes))
					scope.$apply(function() {
						scope.listVisible = false;
					});
			});
        }
	}
});