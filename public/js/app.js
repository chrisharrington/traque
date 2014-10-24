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
    "modal/modal"
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
			cancel: "="
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
		compile: function(element) {
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

require.register("init", function(exports, require, module) {
require("pages");
require("directives");

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when("/timer", { templateUrl: "pages/timer.html", controller: "timer" })
		.otherwise({ redirectTo: "/timer" });
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

require.register("pages/index", function(exports, require, module) {
["timer/timer"].forEach(function(location) {
	require("pages/" + location);
});
});

require.register("pages/timer/timer", function(exports, require, module) {
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
});

require.register("stores/base", function(exports, require, module) {
var Config = require("config"),
	
	emitter = require("dispatcher/emitter"),
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

app.factory("baseStore", function($timeout, $http) {
	return function(model, constants, url) {
		var me = this;

		this.all = function() {
			return new Promise(function(resolve, reject) {
				$timeout(function() {
					emitter.emit(constants.ALL, []);
				}, 250);
			});
		};

		this.update = function(content) {
			return new Promise(function(resolve) {
				$timeout(function() {
					emitter.emit(constants.UPDATE, content);
					resolve();
				}, 500);
			});
		};

		this.create = function(content) {
			return new Promise(function(resolve) {
				$timeout(function() {
					content.id = -1;
					emitter.emit(constants.CREATE, content);
					resolve();
				}, 500);
			});
		};

		this.remove = function(content) {
			return new Promise(function(resolve) {
				$timeout(function() {
					emitter.emit(constants.REMOVE, content);
					resolve();
				}, 500);
			});
		};

		dispatcher.register(function(payload) {
			switch (payload.type) {
				case constants.ALL:
					me.all();
					break;
				case constants.UPDATE:
					me.update(payload.content);
					break;
				case constants.CREATE:
					me.create(payload.content);
					break;
				case constants.REMOVE:
					me.remove(payload.content);
					break;
			}
		});
	}
});
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