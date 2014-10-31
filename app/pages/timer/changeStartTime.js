var Project = require("models/project"),
    ProjectActions = require("actions/project"),
	
	moment = require("moment");

app.directive("changeStartTime", function() {
    return {
        restrict: "E",
        templateUrl: "pages/timer/changeStartTime.html",
        scope: {
            visible: "=",
            start: "="
        },
        link: function(scope) {
            scope.label = "";

            scope.time = {
                hours: "",
                minutes: "",
                seconds: "",
                isPM: true
            };
            
            scope.$watch("start", function(start) {
                if (start === undefined)
                    return;
                
				var parts = moment(start).format("h|mm|ss|a").split("|");
                scope.time.hours = parts[0];
                scope.time.minutes = parts[1];
                scope.time.seconds = parts[2];
                scope.time.isPM = parts[3] === "pm";
            });
            
            scope.ok = function() {
                scope.start = moment(scope.time.hours + "|" + scope.time.minutes + "|" + scope.time.seconds + "|" + (scope.time.isPM ? "pm" : "am"), "h|mm|ss|a");
                scope.visible = false;
            };
        }
    }
});