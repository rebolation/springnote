/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		el: '.todoapp',

		// Our template for the line of statistics at the bottom of the app.
		// statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress .new-todo': 'createOnEnter',
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			this.$input = this.$('.new-todo');
			this.$main = this.$('.main');
			this.$list = $('.todo-list');

			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);
			this.listenTo(app.todos, 'filter', this.filterAll);

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.todos.fetch({reset: true});
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			console.log("addOne")
			var view = new app.TodoView({ model: todo });
			this.$list.append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			console.log("addAll")
			this.$list.html('');
			app.todos.each(this.addOne, this);
		},

		// filterOne: function (todo) {
		// 	todo.trigger('visible');
		// },

		// filterAll: function () {
		// 	app.todos.each(this.filterOne, this);
		// },

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.todos.create(this.newAttributes());
				this.$input.val('');
			}
		},

	});
})(jQuery);