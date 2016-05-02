var tree = {
	// dndpos_temp: null,
	// dndpos: null,
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
		for (var i = 0; i < siblings.length; i++){
			var id = Number(siblings[i].id);
			var order = i;
			var model = _.where(app.notes.models, {"id":id})[0];
			model.save({"order":order},{patch:true});
		}
	}
};

$(document).on('dnd_stop.vakata', function (e, data) {

	//순서변경허용
	$("#jstree").jstree().settings.sort = function(){return -1;}

	//드래그앤드롭한 노트 모델의 부모노트를 저장하고 순서저장함수 콜백
	var id = Number(tree.dndid);
	var pid = Number(tree.dndpid);
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
			// "search",
			// "wholerow"
		],
		'sort': function (a, b) {
			// return -1;
			return this.get_node(a).original.order > this.get_node(b).original.order ? 1 : -1
		}				
	}
};