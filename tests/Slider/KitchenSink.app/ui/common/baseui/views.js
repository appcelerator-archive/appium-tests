function views(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#fff'
	});

	//create table view data object
	var data = [
		{title:'List View', hasChild:true, test:'ui/common/baseui/list_views'},
		{title:'Image Views', hasChild:true, test:'ui/common/baseui/image_views'}
	];

	// create table view
	for (var i = 0; i < data.length; i++ ) {
		var d = data[i];

		if ( (Ti.version >= '3.3.0') && (i == 15)) {
			d.color='#00cc00';
		}
		// On Android, if touchEnabled is not set explicitly, its value is undefined.
		else if (d.touchEnabled !== false) {
			d.color = '#000';
		}
		d.font = {fontWeight:'bold'};
	};
	var tableview = Titanium.UI.createTableView({
		data:data
	});

	// create table view event listener
	tableview.addEventListener('click', function(e)
	{
		if (e.rowData.test)
		{
			var ExampleWindow = require(e.rowData.test);
			win = new ExampleWindow({title: e.rowData.title, containingTab: _args.containingTab, tabGroup: _args.tabGroup});
			_args.containingTab.open(win, {animated:true});
		}
	});

	// add table view to the window
	win.add(tableview);
	return win;
};

module.exports = views;