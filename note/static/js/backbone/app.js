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

	// 캘린더...
	app.cals.fetch({reset: true, url:'/api/v1/calendarevent'}).done(function(){
		$('#calendar').fullCalendar({
			titleFormat: 'YYYY년 MMMM월',
			monthNames: [
				'1','2','3','4','5','6','7','8','9','10','11','12',
			],
			events: function(start, end, timezone, callback) {
				callback(app.cals.toJSON());
			},
			editable: true,
			selectable: true,
			selectHelper: true,
			businessHours: true,
			select: function(start, end) {
				var title = prompt('Event Title:', '');
				var eventData;
				if (title) {
					eventData = {
						author: '/api/v1/user/' + USERID,
						title: title,
						start: start,
						end: end
					};
					app.cals.create( // 저장 후 id를 받아야 드랍이나 리사이즈 이벤트가 정상 작동함
						eventData, 
						{
							success: function(response){
								eventData.id = response.id;
								eventData._id = response.id;
								$('#calendar').fullCalendar('renderEvent', eventData); // stick? = true
							}
						} 
					);
				}
				$('#calendar').fullCalendar('unselect');
			},
			eventDrop: function(event, delta, revertFunc) {
				var model = _.where(app.cals.models, {"id":event.id})[0];
				model.save( {start: event.start, end: event.end}, { patch:true } );
			},
			eventResize: function(event, delta, revertFunc) {
				var model = _.where(app.cals.models, {"id":event.id})[0];
				model.save( {end: event.end}, { patch:true } );
			},
			eventClick: function(calEvent, jsEvent, view) {
				if (confirm("삭제할까요?"))
				{
					var model = _.where(app.cals.models, {"id":calEvent.id})[0];
					model.destroy({
						success: function(response){
							$('#calendar').fullCalendar( 'removeEvents', calEvent.id );
						}
					})
				}
			}
		})
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