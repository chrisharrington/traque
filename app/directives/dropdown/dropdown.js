var Utilities = require("utilities");

app.directive("dropdown", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "directives/dropdown.html",
        scope: {
            placeholder: "@",
            list: "=",
            property: "@",
			onChange: "=change",
			selected: "="
        },
        link: function(scope) {
            scope.listVisible = false;
            scope.isPlaceholder = true;
			
            scope.select = function(item) {
                scope.isPlaceholder = false;
                scope.selected = item;
				if (scope.onChange !== undefined)
					scope.onChange(item);
            };
            
            scope.isSelected = function(item) {
                return item.id === scope.selected.id;  
            };
            
            $rootScope.$on("documentClicked", function(inner, target) {
                var classes = ["dropdown-display", "clicked"];
				if (!Utilities.hasClasses(target[0], classes) && !Utilities.parentHasClasses(target[0], classes))
					scope.$apply(function() {
						scope.listVisible = false;
					});
			});
			
			scope.$watch("selected", function(value) {
				scope.isPlaceholder = scope.selected[scope.property] === undefined;
				scope.display = scope.selected[scope.property];
			});
        }
	}
});