var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({

		//변경됨
		el: '#noteapp',
		events: {
			'keydown article': 'ctrls',
			'keydown #jstree': 'delete',
			'click #newroot': 'newroot',
			'click #newpost': 'newpost',
			'click #savepost': 'savepost',
			'click #removepost': 'removepost',
		},
		// initialize: function () {
		// 	this.$input = this.$('.new-note');
		// 	this.$list = $('.note-list');
		// 	this.listenTo(app.notes, 'add', this.addOne);
		// 	this.listenTo(app.notes, 'reset', this.addAll);
		// },


		addOne: function (note) {
			var view = new app.NoteView({ model: note });
			this.$list.append(view.render().el);
		},
		addAll: function () {
			this.$list.html('');
			app.notes.each(this.addOne, this);
		},
		// // [C] collection.create -> POST
		// createOnEnter: function (e) {
		// 	if (e.which === ENTER_KEY && this.$input.val().trim()) {
		// 		app.notes.create(
		// 			{
		// 				text: this.$input.val().trim(),
		// 				completed: false,
		// 				author: '/api/v1/user/1',
		// 				parent: null,
		// 				order: app.notes.nextOrder()
		// 			}
		// 		);
		// 		this.$input.val('');
		// 	}
		// },
		newroot: function(){
			app.notes.create(
				{
					text: '새 항목',
					completed: false,
					author: '/api/v1/user/' + USERID,
					parent: '#',
					order: app.notes.nextOrder(),
					content: ''
				}, {
					success: function(response){
						var id = tree.lastselid;
						var lastselnode = $("#jstree").jstree().get_node(tree.lastselid);
						$('#jstree').jstree().deselect_node(lastselnode);
						var newid = $("#jstree").jstree().create_node('#', response.toJSON(), "last");
					}
				}
			);
		},		
		newpost: function(){
			app.notes.create(
				{
					text: '새 항목',
					completed: false,
					author: '/api/v1/user/1',
					parent: Number(tree.lastselid),
					order: app.notes.nextOrder(),
					content: ''
				}, {
					success: function(response){
						var id = tree.lastselid;
						var newid = $("#jstree").jstree().create_node(id, response.toJSON(), "last");
					}
				}
			);
		},
		savepost: function(){
			var id = Number(tree.lastselid);
			var model = _.where(app.notes.models, {"id":id})[0];
			model.save({text: $("article h1").text(), content: $("article .content").html() }, {patch:true, success: function(response){
				var node = $("#jstree").jstree().get_node(response.get('id'));
				$("#jstree").jstree().rename_node(node, response.get('text'));
				$('article').animate({opacity : 0}, 500, function(){$('article').animate({opacity : 1})});				
			}});
		},
		removepost: function(){
			var id = Number(tree.lastselid);
			var model = _.where(app.notes.models, {"id":id})[0];
			model.destroy({
				success: function(response){
					var node = $("#jstree").jstree().get_node(response.get('id'));
					$("#jstree").jstree().delete_node(node);
					$('article h1').html("");
					$('article .content').html("");
				},
				error: function(response){
				}
			})
		},
		ctrls: function(e){
			if (e.ctrlKey || e.metaKey) {
				if (String.fromCharCode(e.which).toLowerCase() == 's') {
					e.preventDefault();
					this.savepost();
				}
			}
		},
		delete: function(e){
			if (e.which == '46')
				this.removepost();
		}
	});
})(jQuery);