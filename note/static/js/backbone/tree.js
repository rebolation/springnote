var tree = {};
tree.dndpos = null;
tree.dnditem = null;
tree.dndparent = null;

$(document).on('dnd_stop.vakata', function (e, data) {

	console.log(tree.dndparent);

	var model = _.where(app.notes.models, {"id":tree.dnditem})[0];
	console.log(model);
	model.id = model.id.replace("/api/v1/note/","");
	model.attributes.id = model.attributes.id.replace("/api/v1/note/","");
	if (tree.dndparent == "#")
		model.attributes.parent = null;
	else
		model.attributes.parent = tree.dndparent;
	model.save_();

	// console.log(tree.dnditem + "을" + tree.dndparent + "의 " + tree.dndpos + "로");
	// console.log(_.where(app.notes.models, {"id":tree.dndparent}))

});

var jstreecore = function(){
	return	{
				'core':{
					'data': app.notes.toJSON(),
					// "check_callback" : true //dnd
					"check_callback" : 
					function(operation, node, node_parent, node_position, more) {
						tree.dndpos = more.pos;
						tree.dnditem = node.id;
						tree.dndparent = node_parent.id;
						return true;
					}
				},
				"plugins" : [
					"dnd", "search",
					"state", "types", "wholerow"
				]	
			}
};