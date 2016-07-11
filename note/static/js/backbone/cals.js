var app = app || {};

(function () {
	'use strict';

	var Cals = Backbone.Collection.extend({
		model: app.Cal,
		url: '/api/v1/calendarevent/'
	});

	app.cals = new Cals();
})();