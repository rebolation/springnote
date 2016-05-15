var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({

		//변경됨
		el: '#noteapp',
		events: {
			'keydown article': 'ctrl_s',
			'keydown #jstree': 'delete',
			'keydown #search': 'search',
			'click #newchild': 'newchild',
			'click #newsibling': 'newsibling',
			'click #savepost': 'savepost',
			'click #removepost': 'removepost',

			'click #underline': 'editor_underline',
			'click #bold': 'editor_bold',
			'click #italic': 'editor_italic',
		},
		initialize: function () {
			this.$search = this.$('#search');
		// 	this.$list = $('.note-list');
		// 	this.listenTo(app.notes, 'add', this.addOne);
		// 	this.listenTo(app.notes, 'reset', this.addAll);
		},
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
					parent: '#',
					order: app.notes.nextOrder(),
					content: ''
				}, {
					success: function(response){
						var lastselnode = $("#jstree").jstree().get_node(tree.lastselid);
						$('#jstree').jstree().deselect_node(lastselnode);
						var newid = $("#jstree").jstree().create_node('#', response.toJSON(), "last");
					}
				}
			);
		},		
		newchild: function(){
			app.notes.create(
				{
					text: '새 항목',
					completed: false,
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
		newsibling: function(){
			var id = tree.lastselid;
			var parent = $("#jstree").jstree().get_node(tree.lastselid).parent;
			app.notes.create(
				{
					text: '새 항목',
					completed: false,
					parent: Number(parent),
					order: app.notes.nextOrder(),
					content: ''
				}, {
					success: function(response){
						var lastselnode = $("#jstree").jstree().get_node(tree.lastselid);
						$('#jstree').jstree().deselect_node(lastselnode);
						if(!lastselnode) parent = '#';
						var newid = $("#jstree").jstree().create_node(parent, response.toJSON(), "last");
						var newnode = $("#jstree").jstree().get_node(newid);
						$("#jstree").jstree()._open_to(newnode);
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
			if(USERID == null || USERNAME != USERPAGE) return;
			if(tree.searchmode) { alert("검색화면에서는 삭제할 수 없습니다."); return; }
			if(confirm("삭제할까요?") == false) { return; }

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
		ctrl_s: function(e){
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
		},
		search: function(e){
			var searchword = this.$search.val().trim().toLowerCase();
			var filterednotes = null;
			if (e.which === ENTER_KEY && searchword) {
				filterednotes = app.notes.filter(function(note){
					note.set('parent', '#');
					return note.get('text').toLowerCase().indexOf(searchword) > -1;
				});
				$('#jstree').jstree().settings.core.data = filterednotes;
				$('#jstree').jstree().refresh();
				tree.searchmode = true;
			}
			if (e.which === ENTER_KEY && searchword === ""){
				location.href="/"+USERPAGE;
				// $('#jstree').jstree().settings.core.data = app.notes;
				// $('#jstree').jstree().refresh();				
				// tree.searchmode = false;
			}
		},

		editor_underline: function(){
			document.execCommand("underline", false, null);
		},
		editor_bold: function(){
			document.execCommand("bold", false, null);
		}, 		
		editor_italic: function(){
			document.execCommand("italic", false, null);
		}, 

	});
})(jQuery);