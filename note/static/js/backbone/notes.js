var app = app || {};

(function () {
	'use strict';

	var Notes = Backbone.Collection.extend({
		model: app.Note,
		url: '/api/v1/note/',
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
	});

	app.notes = new Notes();
})();