var app = app || {};

(function () {
	'use strict';

	var NoteRouter = Backbone.Router.extend({
        routes: {
            "note/:id": "view",
            "": "visitroot"
        },

        //라우팅 시 본문을 불러온다
        view: function( id ) {
			if(tree == undefined || tree.lastselid != id) {
				$.ajax({
					url:'/note/'+id,
					cache: false, //URL에 타임스탬프를 붙여 요청한다. 그런데 결과는 최신이 아니다. 왜 그러지?
					success:function(html){
						$('article h1').text($("#jstree").jstree().get_node(id).text);
						$("#jstree").jstree().deselect_all();
						$("#jstree").jstree().select_node(id);
						$('article .content').html(html);
						$(window).scrollTop(0,0);
						var lastselnode = $("#jstree").jstree().get_node(id);
						$("#jstree").jstree().close_all();
						$("#jstree").jstree()._open_to(lastselnode);
						$("#jstree").jstree().open_node(lastselnode);
						app.router.navigate('//note/' + id + '/');
						tree.lastselid = id;
					}
				})
			}
        },

        //노트id 없이 사용자 기본 홈 접속 시...(tree.js에서 처리)
        visitroot: function() {
        	tree.visitroot = true;
        }
	});

	app.router = new NoteRouter();
	Backbone.history.start();
})();