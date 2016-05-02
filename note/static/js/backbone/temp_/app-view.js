/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({

		// el: '.todoapp',

		events: {
			'keypress .new-todo': 'createOnEnter',
		},

		initialize: function () {
			// this.$input = this.$('.new-todo');
			// this.$main = this.$('.main');
			// this.$list = $('.todo-list');
			this.listenTo(app.notes, 'add', this.addOne);
			this.listenTo(app.notes, 'reset', this.addAll);
			// this.listenTo(app.notes, 'filter', this.filterAll);

			app.notes.fetch({reset: true}).done(function(){
				// $("#jstree").jstree(jstreecore());
			});

		},

		addOne: function (note) {
			// var view = new app.NoteView({ model: note });
			// this.$list.append(view.render().el);
		},

		addAll: function () {
			// this.$list.html('');
			// app.notes.each(this.addOne, this);
		},

		// filterOne: function (todo) {
		// 	todo.trigger('visible');
		// },

		// filterAll: function () {
		// 	app.notes.each(this.filterOne, this);
		// },

		// newAttributes: function () {
		// 	return {
		// 		title: "테스트",
		// 		author: "/api/v1/user/1"
		// 	};
		// },

		// createOnEnter: function (e) {
		// 	if (e.which === ENTER_KEY && this.$input.val().trim()) {
				// app.notes.create(this.newAttributes());
		// 		this.$input.val('');
		// 	}
		// },

	});
})(jQuery);