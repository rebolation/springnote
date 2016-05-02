//jstree순서변경
var tree = {
	dndid: null,
	dndpid: null,

	//드래그한 노드의 모든 형제노드의 order를 PATCH
	updateorder: function(){ 
		var parent = $("[id='"+tree.dndpid+"']");
		var siblings = null;
		if (tree.dndpid == "#")
			siblings = $('#jstree').data().jstree.get_json('#', {no_state:true, no_data:true});
		else
			siblings = $('#jstree').data().jstree.get_json(parent, {no_state:true, no_data:true}).children;
		for (var i = 0; i < siblings.length; i++){
			var id = Number(siblings[i].id);
			var order = i;
			var model = _.where(app.notes.models, {"id":id})[0];
			model.save({"order":order},{patch:true});
		}
	}
};

//드래그한 노드의 parent를 PATCH & updateorder 호출
$(document).on('dnd_stop.vakata', function (e, data) {
	var id = Number(tree.dndid);
	var pid = tree.dndpid == "#" ? "#" : Number(tree.dndpid);
	var model = _.where(app.notes.models, {"id":id})[0];
	model.save({"parent":pid},{patch:true, success:tree.updateorder});
});

//백본컬렉션으로부터 json을 가져옴
var jstreecore = function(){
	var data = app.notes.toJSON();
	return	{
		'core':{
			'data': data,
			'multiple': false,
			"check_callback" : 
			function(operation, node, node_parent, node_position, more) {
				tree.dndid = node.id;
				tree.dndpid = node_parent.id;
				return true;
			}
		},
		"plugins" : [
			"dnd",
			"state",
			"wholerow",
			// "contextmenu",
			// "sort",
			// "search",
		],
	}
};