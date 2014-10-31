(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("actions/base", function(exports, require, module) {
module.exports = function(constants) {
	this.all = function() {
		return {
			type: constants.ALL
		};
	};
	
	this.create = function(content) {
		return {
			type: constants.CREATE,
			content: content
		};
	};
};
});

require.register("actions/project", function(exports, require, module) {
var BaseAction = require("actions/base"),
	constants = require("events/constants");

module.exports = new BaseAction(constants.project);
});

require.register("config", function(exports, require, module) {
module.exports = {
    apiUrl: "fixtures/"  
};
});

require.register("controller", function(exports, require, module) {
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
        
        app.controller(key, function($scope, $rootScope, $interval, $timeout) {
            if (_first === true)
                params.init($rootScope, $scope);
            
            _first = false;
            
            params.methods($rootScope, $scope, $interval, $timeout);
            params.load($rootScope, $scope, $interval, $timeout);
        });
    }
};
});

require.register("directives/checkbox/checkbox", function(exports, require, module) {
app.directive("checkbox", function($sce) {
	return {
		restrict: "E",
		templateUrl: "directives/checkbox.html",
		transclude: true,
		scope: {
			checked: "="
		},
		link: function(scope, element, attributes) {
			scope.info = $sce.trustAsHtml(attributes.info);
			scope.showing = false;
			scope.infoVisible = attributes.info && attributes.info != "";

			scope.toggle = function(event) {
				var target = $(event.target);
				if (target.hasClass("fa-question") || target.parents("modal").length > 0)
					return;

				scope.checked = !scope.checked;
			};
		}
	};
});
});

require.register("directives/dropdown/dropdown", function(exports, require, module) {
var Utilities = require("utilities");

app.directive("dropdown", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "directives/dropdown.html",
        scope: {
            placeholder: "@",
            list: "=",
            property: "@",
			onChange: "=change",
			selected: "="
        },
        link: function(scope) {
            scope.listVisible = false;
            scope.isPlaceholder = true;
			
            scope.select = function(item) {
                scope.isPlaceholder = false;
                scope.selected = item;
				if (scope.onChange !== undefined)
					scope.onChange(item);
            };
            
            scope.isSelected = function(item) {
                return item.id === scope.selected.id;  
            };
            
            $rootScope.$on("documentClicked", function(inner, target) {
                var classes = ["dropdown-display", "clicked"];
				if (!Utilities.hasClasses(target[0], classes) && !Utilities.parentHasClasses(target[0], classes))
					scope.$apply(function() {
						scope.listVisible = false;
					});
			});
			
			scope.$watch("selected", function(value) {
				scope.isPlaceholder = scope.selected[scope.property] === undefined;
				scope.display = scope.selected[scope.property];
			});
        }
	}
});
});

require.register("directives/index", function(exports, require, module) {
[
    "menu/menu",
    "menu/menuItem",
    "profileImage/profileImage",
	"dropdown/dropdown",
	"checkbox/checkbox",
	"text/text",
    "modal/modal",
    "time"
].forEach(function(location) {
	require("directives/" + location);
})
});

;require.register("directives/menu/menu", function(exports, require, module) {
var Utilities = require("utilities");

app.directive("menu", function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "directives/menu.html",
		scope: {
			trigger: "@",
			visible: "="
		},
		link: function(scope) {
			scope.name = "Chris Harrington";
			scope.email = "chrisharrington99@gmail.com";
			
			$rootScope.$on("documentClicked", function(inner, target) {
				if (!Utilities.hasClass(target[0], scope.trigger) && !Utilities.parentHasClass(target[0], scope.trigger))
					scope.$apply(function() {
						scope.visible = false;
					});
			});
		}
	}
});
});

require.register("directives/menu/menuItem", function(exports, require, module) {
app.directive("menuItem", function() {
    return {
        restrict: "E",
        templateUrl: "directives/menuItem.html",
        transclude: true,
		scope: {
			icon: "@",
			url: "@"
		}
    };
});
});

require.register("directives/modal/modal", function(exports, require, module) {
app.directive("modal", function($rootScope, $timeout) {
	return {
		restrict: "E",
		templateUrl: "directives/modal.html",
		transclude: true,
		scope: {
			visible: "=",
			title: "@",
			loading: "=",
			ok: "=",
			cancel: "=",
			bindings: "="
		},
		link: function(scope, element, attributes) {
			scope.close = function() {
				scope.visible = false;
				if (scope.cancel !== undefined)
					scope.cancel();
			};

			$rootScope.$on("escapePressed", function() {
				scope.$apply(function() {
					if (scope.visible === true) {
						scope.close();
					}
				});
			});
		}
	};
});
});

require.register("directives/profileImage/profileImage", function(exports, require, module) {
app.directive("profileImage", function($rootScope, md5) {
	return {
		restrict: "E",
		templateUrl: "directives/profileImage.html",
		scope: {
			email: "=",
			size: "@",
			id: "="
		},
		link: function(scope, element, attributes) {
			scope.location = "http://gravatar.com/avatar/" + md5.createHash(scope.email) + "?s=" + (scope.size || 35) + "&d=mm";
		}
	}
});
});

require.register("directives/text/text", function(exports, require, module) {
app.directive("text", function() {
	return {
		restrict: "E",
		templateUrl: "directives/text.html",
		scope: {
			type: "@",
			placeholder: "@",
			name: "@",
			tab: "@tabindex",
			focus: "@",
			value: "&",
			ngModel: "="
		},
		link: function(scope, element) {
			$(element).on("focus", "input", function() {
				$(element).addClass("focus");
			});

			$(element).on("blur", "input", function() {
				$(element).removeClass("focus");
			});
		}
	}
});
});

require.register("directives/time", function(exports, require, module) {
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
});

;require.register("events/constants", function(exports, require, module) {
module.exports = {
	user: {
        ALL: "all-users",
		CREATE: "create-user"
    },
    
    project: {
        ALL: "all-projects",
        CREATE: "create-project"
    }
};
});

require.register("events/dispatcher", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Dispatcher = require("flux").Dispatcher;

module.exports = new Dispatcher();
});

require.register("events/emitter", function(exports, require, module) {
module.exports = new function() {
    this._registrants = {};
    
    this.on = function(key, registrant) {
        if (!key || !registrant)
            return;
        
        if (!this._registrants[key])
            this._registrants[key] = [];
        this._registrants[key].push(registrant);
    };
    
    this.emit = function(key, data) {
        if (!key || !this._registrants[key])
            return;
        
        this._registrants[key].forEach(function(registrant) {
            registrant(data); 
        });
    };
};
});

require.register("extensions/index", function(exports, require, module) {
["number"].forEach(function(location) {
    require("extensions/" + location);
});
});

require.register("extensions/number", function(exports, require, module) {
Number.prototype.pad = function(length, char) {
    if (length === undefined)
        length = 2;
    if (char === undefined)
        char = "0";
    return (char + this).slice(length * -1);
}
});

;require.register("init", function(exports, require, module) {
require("pages");
require("directives");
require("stores");
require("extensions");

app.config(function($routeProvider) {
	$routeProvider.otherwise({ redirectTo: "/timer" });
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
});

require.register("models/base", function(exports, require, module) {
module.exports = function(params) {
    params = params || {};
    _.extend(this, params);
    
    this.validate = params.validate || function() {
        return true;
    };
}
});

;require.register("models/project", function(exports, require, module) {
var BaseModel = require("models/base");

module.exports = BaseModel;
});

require.register("pages/index", function(exports, require, module) {
[
    "timer/timer",
    "timer/changeStartTime"
].forEach(function(location) {
	require("pages/" + location);
});
});

require.register("pages/timer/changeStartTime", function(exports, require, module) {
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
});

require.register("pages/timer/timer", function(exports, require, module) {
var ProjectActions = require("actions/project"),
    Project = require("models/project"),
    Controller = require("controller"),
    
    dispatcher = require("events/dispatcher"),
    emitter = require("events/emitter"),
    constants = require("events/constants");

var _next, _seconds, _interval;

Controller.create(app, "timer", {
    url: "/timer",
    template: "pages/timer/timer.html",
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
        
		scope.paused = false;
        
        scope.timerVisible = false;
        scope.changeStartTimeVisible = false;
		
		scope.newProject = _buildNewProjectContainer(scope);
        
        _seconds = 0;
        _getNext(++_seconds);
        
//        scope.$watch("start", function(start) {
//            _seconds = (new Date() - start)/60/1000;
//            _getNext(_seconds);
//        });
    },
    
    methods: function(rootScope, scope, interval, timeout) {
        scope.onSelect = function(selected) {
            if (selected.id === 0)
                scope.newProject.visible = true;
        };
        
        scope.start = function() {
            scope.startTime = new Date();
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
});

;require.register("stores/base", function(exports, require, module) {
var dispatcher = require("events/dispatcher"),
    emitter = require("events/emitter")
    config = require("config");

var _id = 100;

module.exports = function(constants, collection) {
    var me = this;
    
    this.all = function() {
        if (this._collection !== undefined)
            emitter.emit(constants.ALL, this._collection);
        else {
            $.getJSON(config.apiUrl + collection).then(function(models) {
                me._collection = models;
                emitter.emit(constants.ALL, models);
            }).fail(function(e) {
                emitter.emit(constants.ALL, e);
            });
        }
    };
    
    this.create = function(item) {
        $.post(config.apiUrl + collection, item).then(function() {
            item.id = _id++;
            me._collection.push(item);
            me.all();
            emitter.emit(constants.CREATE, item);
        });
    };
    
    dispatcher.register(function(payload) {
		switch (payload.type) {
			case constants.ALL:
				me.all();
				break;
            case constants.CREATE:
                me.create(payload.content);
                break;
		}
	});
};
});

require.register("stores/index", function(exports, require, module) {
[
    "project"
].forEach(function(location) {
    require("stores/" + location);
});
});

require.register("stores/project", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Project = require("models/project"),
	BaseStore = require("stores/base"),
	
	constants = require("events/constants");

module.exports = new BaseStore(constants.project, "projects");
});

require.register("utilities", function(exports, require, module) {
module.exports = {
    hasClass: function(element, className) {
        return _.contains(element.className.split(" "), className);
    },
    
    parentHasClass: function(element, className) {
        while (element.parentNode !== null) {
			if (this.hasClass(element, className))
				return true;
			
			element = element.parentNode;
		}
		
		return false;
    },
    
    hasClasses: function(element, classes) {
        var me = this;
        return _.every(classes, function(className) {
            return me.hasClass(element, className);
        });
    },
    
    parentHasClasses: function(element, classes) {
        var me = this;
        return _.every(classes, function(className) {
            return me.parentHasClass(element, className); 
        });
    }
};
});


//# sourceMappingURL=app.js.map