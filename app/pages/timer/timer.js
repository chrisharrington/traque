app.controller("timer", function($rootScope, $scope) {
    $scope.projects = [
        { id: 1, name: "Traque" },
        { id: 2, name: "Relincd" },
        { id: 3, name: "WestJet" },
        { id: 4, name: "Leaf" },
        { id: 0, name: "Create New Project..." }
    ];
	
	$scope.project = {};
    
    $scope.newProject = {
        visible: false,
        loading: false,
		name: "",
        
        ok: function() {
            
        },
        
        cancel: function() {
            $scope.newProject.name = "";
			$scope.project = {};
        }
    };
	
	$scope.onSelect = function(selected) {
		if (selected.id === 0)
			$scope.newProject.visible = true;
	};
});