require("pages");
require("directives");

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when("/timer", { templateUrl: "pages/timer.html", controller: "timer" })
		.otherwise({ redirectTo: "/timer" });
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