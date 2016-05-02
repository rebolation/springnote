/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({

		el: '.todoapp',

		events: {
			'keypress .new-todo': 'createOnEnter',
		},

		initialize: function () {
			this.$input = this.$('.new-todo');
			this.$list = $('.todo-list');

			this.listenTo(app.notes, 'add', this.addOne);
			this.listenTo(app.notes, 'reset', this.addAll);

			// [R] collection.fetch -> GET
			app.notes.fetch({reset: true}).done(function(){
				$("#jstree").jstree(jstreecore());
			});
		},

		addOne: function (note) {
			var view = new app.NoteView({ model: note });
			this.$list.append(view.render().el);
		},

		addAll: function () {
			this.$list.html('');
			app.notes.each(this.addOne, this);
		},

		// [C] collection.create -> POST
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.notes.create(
					{
						text: this.$input.val().trim(),
						completed: false,
						author: '/api/v1/user/1',
						parent: null
					}
				);
				this.$input.val('');
			}
		},

	});
})(jQuery);