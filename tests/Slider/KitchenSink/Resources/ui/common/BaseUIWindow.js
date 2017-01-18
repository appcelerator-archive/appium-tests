function BaseUIWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});

	// create table view data object
	var data = [
		{title:'Views', hasChild:true, test:'ui/common/baseui/views'}
	];

	// create table view
	for (var i = 0; i < data.length; i++ ) {
		var d = data[i];
		// On Android, if touchEnabled is not set explicitly, its value is undefined.
		if (d.touchEnabled !== false) {
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
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({title:e.rowData.title,containingTab:self.containingTab,tabGroup:self.tabGroup});
			if (Ti.Platform.name == "android") {

			} else {
				win.backgroundColor = "#fff"
			}


			if (e.index == 3)
			{
				if (Ti.Platform.name == "iPhone OS") {
					win.hideTabBar();
					//IOS7 has a weird bug where it will not resize the ViewController correctly when the tabbar is hidden.
					//TIMOB-14998
					win.extendEdges = [Ti.UI.EXTEND_EDGE_BOTTOM];
					win.includeOpaqueBars = true;
				}
			}
			if (Ti.Platform.name==='android' && e.rowData.test.indexOf('window_properties') >= 0) {
				// As explained in apidoc for Window, if opacity is ever to be changed for an Android
				// activity during its lifetime, it needs to use a translucent background.  We trigger
				// using a translucent theme by the presence of the opacity property, so we need to
				// set it here.  Setting it to 1 means it's totally opaque, but gives us the property to
				// make it more transparent later with the "toggle opacity" test.
				win.backgroundColor = "#191919"
				win.opacity = 1;
			}
			self.containingTab.open(win,{animated:true});
		}
	});

	// add table view to the window
	self.add(tableview);

	return self;
};

module.exports = BaseUIWindow;
