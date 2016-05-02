/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Todo = Backbone.Model.extend({
		defaults: {
			title: '',
		},

		// [U] model.save -> PATCH
		toggleComplete: function () {
			this.save( {completed: !this.get('completed')}, {patch:true} ); //patch:true를 지정하여 put대신 patch로 저장한다
		}
	});
})();