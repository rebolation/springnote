//jstree
var tree = {
	dndid: null,
	dndpid: null,
	lastselid: null,
	searchmode: false,
	visitroot: false,

	//설정
	jstreecore: function(){
		var data = app.notes.toJSON();
		return	{
			'core':{
				'data': data, //백본컬렉션으로부터 json을 가져옴
				'multiple': false,
		        "themes":{
		            "icons":false
		        },
				"check_callback" : 
					function(operation, node, node_parent, node_position, more) {
						tree.dndid = node.id;
						tree.dndpid = node_parent.id;
						return true;
					}
			},
			'dnd':{
				'inside_pos':'last'
			},
			"plugins" : [
				"dnd",
				"state",
				"wholerow",
				// "contextmenu",
				// "types",
				// "sort",
				// "search",
			],
	
		}
		$.jstree.defaults.dnd.inside_pos = 'last';
	},

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

$('#jstree').on('ready.jstree', function(){
	if(tree.visitroot) {
		var id = $("li:first-child").attr("id");
		$("#jstree").jstree().select_node(id);
	}
});


//드래그한 노드의 parent를 PATCH & updateorder 호출
$(document).on('dnd_stop.vakata', function (e, data) {
	var id = Number(tree.dndid);
	var pid = tree.dndpid == "#" ? "#" : Number(tree.dndpid);
	var model = _.where(app.notes.models, {"id":id})[0];
	model.save({"parent":pid},{patch:true, success:tree.updateorder});
});

//노드선택(읽기)
$('#jstree').on("select_node.jstree", function (e, data) {
	var id = data.node.id;
	app.router.navigate('//note/' + id);

	//비밀글 아이콘 토글
	if(data.node.original.ishidden){
		$("#lockpost").addClass("colored");
	} else {
		$("#lockpost").removeClass("colored");
	}	
});

//노드추가
$('#jstree').on("create_node.jstree", function (e, data) {
	$('#jstree').jstree().deselect_node(data.node.parent);
	$('#jstree').jstree().select_node(data.node);
});
