/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Note = Backbone.Model.extend({

		save_: function(data){
			console.log(data);
			console.log(this);
			this.save();
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