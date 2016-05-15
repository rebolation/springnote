var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;
var S_KEY = 115;

$(function () {
	'use strict';

	new app.AppView();

	// 추후 변경사항
	// 사용자의 마지막fetch 날짜 이후 변경사항이 있으면
	//   -> 서버에서 데이터를 가져옴
	// 사용자의 마지막fetch 날짜 이후 변경사항이 없으면
	//   -> 로컬스토리지에서 데이터를 가져옴

	// [R] collection.fetch -> GET
	// fetch url을 notes의 url과 별도로 직접 지정
	app.notes.fetch({reset: true, url:'/api/v1/nav/' + USERPAGEURL}).done(function(){
		$("#jstree").jstree(tree.jstreecore());		
	});

});


// $(window).keypress(function(event) {
//     if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
//     event.preventDefault();
//     return false;
// });
// $(window).bind('keydown', function(event) {
//     if (event.ctrlKey || event.metaKey) {
//     	if (String.fromCharCode(event.which).toLowerCase() == 's') {
//             event.preventDefault();
//             app.savepost();
//         }
//     }
// });