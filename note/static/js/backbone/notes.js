/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Notes = Backbone.Collection.extend({
		model: app.Note,
		url: '/api/v1/note/',
	});

	app.notes = new Notes();
})();