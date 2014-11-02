var moment = require("moment"),
    _ = require("underscore");

app.directive("calendar", function() {
    return {
        restrict: "E",
        templateUrl: "directives/calendar.html",
        scope: {
            selected: "="
        },
        link: function(scope) {
            scope.selected = (scope.selected || moment()).hours(0).minutes(0).seconds(0).milliseconds(0);
            scope.month = scope.selected.clone();
            
            var start = scope.selected.clone();
            start.date(1);
            start.day(0).hour(0).minute(0).second(0).millisecond(0);
            
            _buildMonth(scope, start, scope.month);
            
            scope.select = function(day) {
                scope.selected = day.date;  
            };
            
            scope.next = function() {
                var next = scope.month.clone();
                next.month(next.month()+1).date(1).day(0).hour(0).minute(0).second(0).millisecond(0);
                scope.month.month(scope.month.month()+1);
                _buildMonth(scope, next, scope.month);
            };
            
            scope.previous = function() {
                var previous = scope.month.clone();
                previous.month(previous.month()-1).date(1).day(0).hour(0).minute(0).second(0).millisecond(0);
                scope.month.month(scope.month.month()-1);
                _buildMonth(scope, previous, scope.month);
            };
        }
    };
    
    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }
        
    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});