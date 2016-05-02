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

			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);

			// [R] collection.fetch -> GET
			app.todos.fetch({reset: true});
		},

		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			this.$list.append(view.render().el);
		},

		addAll: function () {
			this.$list.html('');
			app.todos.each(this.addOne, this);
		},

		// [C] collection.create -> POST
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.todos.create(
					{
						title: this.$input.val().trim(),
						completed: false
					}
				);
				this.$input.val('');
			}
		},

	});
})(jQuery);