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
				"wholerow",
				// "state", //백본라우터 적용으로 URL에 맞춰 노드가 열리므로, 노드 열고 닫힌 상태를 저장할 필요가 없음...
				// "contextmenu",
				// "types",
				// "sort",
				// "search",
			],
	
		}
		$.jstree.defaults.dnd.inside_pos = 'last';
		$.jstree.defaults.dnd.touch = 'false'; //'selected'
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

// 노트 목록 준비
$('#jstree').on('ready.jstree', function(){

	//목록이 준비되면 백본히스토리를 시작(준비 전에 시작하면 router.js의 $("#jstree").jstree() 등이 오동작)
	Backbone.history.start();

	//노트 id 없이 사용자 기본 홈으로 접속시 첫번째 노트를 보여준다
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

	//캘린더
	if(data.node.original.text == '캘린더'){
		$("#calendar").css('visibility', 'visible');
		$("#calendar").css('height', 'auto');
		$("article>h1").text('');
		$("article>.content").text('');
	} else {
		$("#calendar").css('visibility', 'hidden');
		$("#calendar").css('height', '0px');
	}

	//모바일일 때 목록 끄기
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent)) {
        $("nav").addClass('hidden');
	}

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
