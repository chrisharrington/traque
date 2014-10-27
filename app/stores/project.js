/* jshint node: true */
"use strict";

var Project = require("models/project"),
	BaseStore = require("stores/base"),
	
	constants = require("events/constants");

module.exports = new BaseStore(constants.project, "projects");