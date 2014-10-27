var _first = true;

module.exports = {
    create: function(app, key, route, params) {
        app.config(function($routeProvider) {
            $routeProvider.when(route.url, { templateUrl: route.template, controller: key });
        });
        
        app.run(function($rootScope) {
            $rootScope.$on("$routeChangeSuccess", function(scope, context) {
                if (context.loadedTemplateUrl === route.template)
                    $rootScope.title = route.title;
            }); 
        });
        
        app.controller(key, function($scope, $rootScope) {
            if (_first === true)
                params.init($rootScope, $scope);
            
            _first = false;
            
            params.methods($rootScope, $scope);
            params.load($rootScope, $scope);
        });
    }
};