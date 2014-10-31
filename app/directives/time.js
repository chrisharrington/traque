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

                var isPM = true;
                var hours = value.getHours();
                if (hours < 12)
                    isPM = false;
                if (hours > 12)
                    hours -= 12;

                scope.time = hours + ":" + _pad(scope.value.getMinutes()) + ":" + _pad(scope.value.getSeconds()) + " " + (isPM ? "pm" : "am");
            });
        }
    } 
});

function _pad(number) {
    return ("0" + number).slice(-2);
}