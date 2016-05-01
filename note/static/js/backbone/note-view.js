/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	// 'use strict';

	app.NoteView = Backbone.View.extend({
		// tagName:  'li',

		// template: _.template($('#item-template').html()),

		// events: {
		// 	'click .toggle': 'toggleCompleted',
		// 	'dblclick label': 'edit',
		// 	'click .destroy': 'clear',
		// 	'keypress .edit': 'updateOnEnter',
		// 	'keydown .edit': 'revertOnEscape',
		// 	'blur .edit': 'close'
		// },

		// initialize: function () {
		// 	this.listenTo(this.model, 'change', this.render);
		// 	this.listenTo(this.model, 'destroy', this.remove);
		// 	this.listenTo(this.model, 'visible', this.toggleVisible);
		// },

		// render: function () {
		// 	this.$el.html(this.template(this.model.toJSON()));
		// 	this.$el.toggleClass('completed', this.model.get('completed'));
		// 	this.toggleVisible();
		// 	this.$input = this.$('.edit');
		// 	return this;
		// },

		// toggleVisible: function () {
		// 	this.$el.toggleClass('hidden', this.isHidden());
		// },

		// isHidden: function () {
		// 	return this.model.get('completed') ?
		// 		app.TodoFilter === 'active' :
		// 		app.TodoFilter === 'completed';
		// },

		// toggleCompleted: function () {
		// 	this.model.toggle();
		// },

		// edit: function () {
		// 	this.$el.addClass('editing');
		// 	this.$input.focus();
		// },

		// close: function () {
		// 	var value = this.$input.val();
		// 	var trimmedValue = value.trim();

		// 	// We don't want to handle blur events from an item that is no
		// 	// longer being edited. Relying on the CSS class here has the
		// 	// benefit of us not having to maintain state in the DOM and the
		// 	// JavaScript logic.
		// 	if (!this.$el.hasClass('editing')) {
		// 		return;
		// 	}

		// 	if (trimmedValue) {
		// 		this.model.save({ title: trimmedValue });
		// 	} else {
		// 		this.clear();
		// 	}

		// 	this.$el.removeClass('editing');
		// },

		// updateOnEnter: function (e) {
		// 	if (e.which === ENTER_KEY) {
		// 		this.close();
		// 	}
		// },

		// revertOnEscape: function (e) {
		// 	if (e.which === ESC_KEY) {
		// 		this.$el.removeClass('editing');
		// 		// Also reset the hidden input back to the original value.
		// 		this.$input.val(this.model.get('title'));
		// 	}
		// },

		// clear: function () {
		// 	this.model.destroy();
		// }
	});
})(jQuery);