app.directive("time", function() {
    return {
        restrict: "E",
        template: "{{time}}",
        scope: {
            value: "="
        },
        link: function(scope) {
            scope.$watch("value", function(value) {
				if (value === undefined || value === "")
                    return;

                scope.time = moment(value).format("h:mm:ss a");
            });
        }
    } 
});

function _pad(number) {
    return ("0" + number).slice(-2);
}