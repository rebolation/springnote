/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Todos = Backbone.Collection.extend({
		model: app.Todo,
		url: '/api/v1/todo/',
	});

	app.todos = new Todos();
})();