var tree = {
	dndpos_temp: null,
	dndpos: null,
	dndid: null,
	dndpid: null,
	updateorder: function(){

		//형제노트의 순서를 저장
		var parent = $("[id='"+tree.dndpid+"']");
		var siblings = null;
		if (tree.dndpid == "#")
			siblings = $('#jstree').data().jstree.get_json();
		else
			siblings = $('#jstree').data().jstree.get_json(parent).children;

		// console.log(siblings);
		
		for (var i = 0; i < siblings.length; i++){
			var id = siblings[i].id;
			var order = i;
			// console.log(id);
			// tree.modelpatch(tree.dndid, {"order":order}, null);

			var model = _.where(app.notes.models, {"id":id})[0];
			id = model.get('id').replace("/api/v1/note/","");
			console.log(id);
			model.save(id, {"order":order}, {patch:true});
			model.set('id', "/api/v1/note/"+id);			

		}
	},
	modelpatch: function(id, data, callback){
		var model = _.where(app.notes.models, {"id":id})[0];
		id = model.get('id').replace("/api/v1/note/","");
		data.id = id;
		console.log(data)
		model.save(data, {patch:true, success:callback });
		model.set('id', "/api/v1/note/"+id);
	}
};

$(document).on('dnd_stop.vakata', function (e, data) {

	//순서변경이 가능하도록
	$("#jstree").jstree().settings.sort = function(){return -1;}

	//드래그앤드롭한 노트 모델의 부모노트를 저장
	var pid = tree.dndpid;
	pid = pid == "#" ? null : pid;
	// console.log(tree.dndid);

		var id = tree.dndid;

		var model = _.where(app.notes.models, {"id":id})[0];
		console.log(model);
		model.save({"text":"test"},{patch:true});

		// id = model.get('id').replace("/api/v1/note/","");
		// data.id = id;
		// console.log(data)
		// model.set('id', "/api/v1/note/"+id);



	// tree.modelpatch(tree.dndid, {"parent":pid}, function(){
	// 	tree.updateorder();
	// });

});

var jstreecore = function(){
	return	{
		'core':{
			'data': app.notes.toJSON(),
			// "check_callback" : true //dnd
			"check_callback" : 
			function(operation, node, node_parent, node_position, more) {
				tree.dndpos = tree.dndpos_temp;
				tree.dndpos_temp = more.pos; //b(efore),i(nside),a(fter)
				tree.dndid = node.id;
				tree.dndpid = node_parent.id;
				return true;
			}
		},
		"plugins" : [
			"dnd",
			"sort",
			"state",
			"search",
			// "types",
			"wholerow"
		],
		'sort': function (a, b) {
			return this.get_node(a).original.order > this.get_node(b).original.order ? 1 : -1
		}				
	}
};