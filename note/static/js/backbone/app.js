var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
	'use strict';

	new app.AppView();

	// 추후 변경사항
	// 사용자의 마지막fetch 날짜 이후 변경사항이 있으면
	//   -> 서버에서 데이터를 가져옴
	// 사용자의 마지막fetch 날짜 이후 변경사항이 없으면
	//   -> 로컬스토리지에서 데이터를 가져옴

	// [R] collection.fetch -> GET
	app.notes.fetch({reset: true}).done(function(){
		$("#jstree").jstree(tree.jstreecore());
	});

});