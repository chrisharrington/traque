require("pages");
require("directives");
require("stores");
require("extensions");

app.config(function($routeProvider) {
	$routeProvider.otherwise({ redirectTo: "/timer" });
});

app.run(function($rootScope) {
	$rootScope.menuVisible = false;
	
	angular.element(document).on("click", function(e) {
		$rootScope.$broadcast("documentClicked", angular.element(e.target));
	});
    
    angular.element(document).on("keyup", function(e) {
        if (e.keyCode === 27)
		  $rootScope.$broadcast("escapePressed", angular.element(e.target));
	});
});