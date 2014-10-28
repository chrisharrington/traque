var ProjectActions = require("actions/project"),
    Project = require("models/project"),
    Controller = require("controller"),
    
    dispatcher = require("events/dispatcher"),
    emitter = require("events/emitter"),
    constants = require("events/constants");

var _next, _seconds, _interval;

Controller.create(app, "timer", {
    url: "/timer",
    template: "pages/timer.html",
    title: "Timer"
}, {
    init: function(rootScope, scope) {
        emitter.on(constants.project.ALL, function(projects) {
            scope.projects = [{ id: 0, name: "Create a project..." }].concat(projects);
        });
        
        emitter.on(constants.project.CREATE, function(created) {
            scope.$apply(function() {
                scope.newProject.visible = false;
                scope.newProject.project = {};
                scope.newProject.loading = false;
                scope.project = created;
            });
        });
        
        dispatcher.dispatch(ProjectActions.all());
    },
    
    load: function(rootScope, scope) {
        scope.project = {};
        scope.timer = "00:00:00";
        scope.timerVisible = false;
		scope.paused = false;
		
		scope.newProject = _buildNewProjectContainer(scope);
		scope.changeStartTime = _buildChangeStartTimeContainer(scope);
        
        _seconds = 0;
        _getNext(++_seconds);
    },
    
    methods: function(rootScope, scope, interval, timeout) {
        scope.onSelect = function(selected) {
            if (selected.id === 0)
                scope.newProject.visible = true;
        };
        
        scope.start = function() {
            scope.changeStartTime.start = _start = new Date();
            
            scope.timerVisible = true;
			scope.paused = false;
            _interval = interval(function() {
                scope.timer = _next;
                _getNext(++_seconds);
            }, 1000);
        };
		
		scope.pause = function() {
			scope.paused = !scope.paused;
			if (scope.paused === true)
				interval.cancel(_interval);
			else
				scope.start();
		};
    }
});

function _getNext(count) {
    var seconds = count%60;
    var minutes = Math.floor(count/60);
    var hours = Math.floor(count/3600);
    _next = _pad(hours) + ":" + _pad(minutes) + ":" + _pad(seconds);
}
    
function _pad(number) {
    return ("0" + number).slice(-2);
}

function _buildChangeStartTimeContainer(scope) {
	return {
		visible: false,
		newHours: "12",
		
		ok: function() {
			
		}
	}
}

function _buildNewProjectContainer(scope) {
    return {
        visible: false,
        loading: false,

        project: new Project(),

        ok: function() {
            scope.newProject.loading = true;
            dispatcher.dispatch(ProjectActions.create(scope.newProject.project));
        },

        cancel: function() {
            scope.newProject.name = "";
            scope.project = {};
        }
    };
}