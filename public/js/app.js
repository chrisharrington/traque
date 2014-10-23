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
require.register("directives/index", function(exports, require, module) {
[
    "menu/menu",
    "menu/menuItem",
    "profileImage/profileImage"
].forEach(function(location) {
	require("directives/" + location);
})
});

;require.register("directives/menu/menu", function(exports, require, module) {
app.directive("menu", function() {
	return {
		restrict: "E",
		templateUrl: "directives/menu.html",
		link: function(scope) {
			scope.name = "Chris Harrington";
			scope.email = "chrisharrington99@gmail.com";
		}
	}
});
});

require.register("directives/menu/menuItem", function(exports, require, module) {
app.directive("menuItem", function() {
    return {
        restrict: "E",
        templateUrl: "directives/menuItem.html",
        transclude: true
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

require.register("init", function(exports, require, module) {
require("pages");
require("directives");

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when("/test", { templateUrl: "pages/test.html", controller: "test" })
		.otherwise({ redirectTo: "/test" });
});
});

require.register("pages/index", function(exports, require, module) {
["test/test"].forEach(function(location) {
	require("pages/" + location);
});
});

require.register("pages/test/test", function(exports, require, module) {
app.controller("test", function($scope) {
	$scope.text = "Hello, world!";
});
});


//# sourceMappingURL=app.js.map