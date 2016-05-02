/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Note = Backbone.Model.extend({

		urlRoot: '/app/v1/note',

		save_: function(){
			console.log("save_")
			this.save({patch:true})
		}

		// defaults: {
		// 	id:'',
		// 	text: '',
		// },

		// toggle: function () {
		// 	this.save( {completed: !this.get('completed')}, {patch:true} ); //patch:true를 지정하여 put대신 patch로 저장한다
		// }

	});
})();