var tree = {
	// dndpos_temp: null,
	// dndpos: null,
	dndid: null,
	dndpid: null,

	//순서저장(형제)
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

$(document).on('dnd_stop.vakata', function (e, data) {

	//정렬로직을 무효화하여 자동정렬을 막는다
	$("#jstree").jstree().settings.sort = function(a,b){
		return -1;
	}

	//드래그한 모델에 부모를 재지정하고 순서저장함수 호출
	var id = Number(tree.dndid);
	var pid = tree.dndpid == "#" ? "#" : Number(tree.dndpid);
	var model = _.where(app.notes.models, {"id":id})[0];
	model.save({"parent":pid},{patch:true, success:tree.updateorder});

});

var jstreecore = function(){
	
	var data = app.notes.toJSON();
	// data = JSON.stringify(data).replace(/"parent":null/gi,'"parent":"#"');
	// data = JSON.parse(data);

	return	{
		'core':{
			'data': data,
			'multiple': false,
			"check_callback" : 
			function(operation, node, node_parent, node_position, more) {
				// tree.dndpos = tree.dndpos_temp;
				// tree.dndpos_temp = more.pos; //b(efore),i(nside),a(fter)
				tree.dndid = node.id;
				tree.dndpid = node_parent.id;
				return true;
			}
		},
		"plugins" : [
			"dnd",
			"sort",
			"state",
			// "contextmenu",
			// "search",
			"wholerow"
		],
		'sort': function (a, b) {
			return this.get_node(a).original.order > this.get_node(b).original.order ? 1 : -1
		}
	}
};