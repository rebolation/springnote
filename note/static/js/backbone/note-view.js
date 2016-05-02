/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.TodoView = Backbone.View.extend({
		tagName:  'li',

		template: _.template($('#item-template').html()),

		events: {
			'click .toggle': 'toggleCompleted',
			'click .destroy': 'clear',
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		toggleCompleted: function () {
			this.model.toggleComplete();
		},

		// [D] model.destroy -> DELETE
		clear: function () {
			this.model.destroy();
		}
	});
})(jQuery);