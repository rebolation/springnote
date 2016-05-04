var app = app || {};

(function () {
	'use strict';

	app.Note = Backbone.Model.extend({
		// // [U] model.save -> PATCH
		// toggleComplete: function () {
		// 	this.save( {completed: !this.get('completed')}, {patch:true} ); //patch:true를 지정하여 put대신 patch로 저장한다
		// }
	});
})();