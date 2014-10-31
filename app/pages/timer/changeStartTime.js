var Project = require("models/project"),
    ProjectActions = require("actions/project");

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
                
                var hours = start.getHours(), isPM = scope.time.isPM || false;
                if (hours < 12)
                    isPM = false;
                if (hours > 12)
                    hours -= 12;

                scope.time.hours = hours;
                scope.time.minutes = start.getMinutes().pad();
                scope.time.seconds = start.getSeconds().pad();
                scope.time.isPM = isPM;
            });
            
            scope.ok = function() {
                var date = new Date(), hours = parseInt(scope.time.hours);
                date.setHours(scope.time.isPM ? hours : (hours - 12));
                date.setMinutes(parseInt(scope.time.minutes));
                date.setSeconds(parseInt(scope.time.seconds));
                scope.start = date;
                scope.visible = false;
            };
        }
    }
});