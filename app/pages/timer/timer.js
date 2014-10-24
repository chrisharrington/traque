app.controller("timer", function($scope) {
    $scope.projects = [
        { id: 1, name: "Traque" },
        { id: 2, name: "Relincd" },
        { id: 3, name: "WestJet" },
        { id: 4, name: "Leaf" },
        { id: 0, name: "Create New Project..." }
    ];
    
    $scope.newProject = {
        visible: false,
        loading: false,
        
        ok: function() {
            
        },
        
        cancel: function() {
            
        }
    };
});