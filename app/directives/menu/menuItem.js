app.directive("menuItem", function() {
    return {
        restrict: "E",
        templateUrl: "directives/menuItem.html",
        transclude: true
    };
});