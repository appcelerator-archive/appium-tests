function list_views(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title
	});
	if (Ti.Platform.name == 'android')
	{
		win.backgroundColor = '#4e5c4d';
	}
	else
	{
		win.backgroundColor = '#aebcad';
	}
	var platformName = Titanium.Platform.osname;
	var isAndroid = (platformName == 'android');
	var isIOS = (platformName == 'iphone' || platformName == 'ipad');
	var isValidVersion = (Ti.version >= '3.1.0');
	var isValidPlatform = isAndroid || isIOS;

	var listViewDefined = true;
	try {
		var isdefined = (Ti.UI.LIST_ACCESSORY_TYPE_DETAIL);
		listViewDefined = ((isdefined !== undefined) && (isdefined !== null));
	} catch(e){
		listViewDefined = false;
	}

	if (!(isValidVersion && isValidPlatform && listViewDefined)) {
		var error = 'LIST VIEW is currently supported on iOS and android and requires a version 3.1.0 or greater.';
		if (isValidVersion && isValidPlatform) {
			error += '\n\nDid not find list view. Update to latest build.';
		}
		var label = Ti.UI.createLabel({
			text:error,
			color:'red',
			font:{fontWeight:'bold',fontSize:'20dp'},
			wordWrap:true
		});
		win.add(label);

		return win;
	}

	var listView = Ti.UI.createListView({
		headerTitle:'THIS IS A LIST VIEW TOO',
	});
	if (isIOS) {
		listView.style=Ti.UI.iPhone.ListViewStyle.GROUPED;
	}
	var sections = [];

	var basicSection = Ti.UI.createListSection({ headerTitle: 'Basic Functions'});
	var basicDataSet = [
		{properties: { title: 'Built in templates', itemId: 'list_basic', accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DETAIL, height:44}}
	];
	basicSection.setItems(basicDataSet);
	sections.push(basicSection);

	listView.setSections(sections);

	listView.addEventListener('itemclick',function(e){
		Ti.API.info('GOT ITEM CLICK WITH itemIndex: '+e.itemIndex+' and sectionIndex: '+e.sectionIndex);
		if (e.itemId) {
			var url = 'ui/common/baseui/listview/'+e.itemId;
			var ListTest = require(url);
			var listWin = new ListTest({containingTab: _args.containingTab, tabGroup: _args.tabGroup});
			_args.containingTab.open(listWin,{animated:true});
		}
		else {
			alert('NO itemId in event. Check data. If data is right, file bug in JIRA.');
		}
	});
	win.add(listView);

	return win;

};
module.exports = list_views;