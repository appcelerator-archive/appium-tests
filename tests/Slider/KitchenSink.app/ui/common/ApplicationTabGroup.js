// Keep a reference to this window so it does not get collected on Android.
var messageWin;
function ApplicationTabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup(),
		BaseUIWindow = require('ui/common/BaseUIWindow'),
		ControlsWindow = require('ui/common/ControlsWindow');

	//create app tabs
	var baseUIWin = new BaseUIWindow(L('base_ui_title')),
		controlsWin = new ControlsWindow(L('controls_win_title'));

	var baseUITab = Ti.UI.createTab({
		title: L('base_ui_title'),
		icon: '/images/tabs/KS_nav_ui.png',
		window: baseUIWin
	});
	baseUIWin.containingTab = baseUITab;

	self.addTab(baseUITab);

	var controlsTab = Ti.UI.createTab({
		title: L('controls_win_title'),
		icon: '/images/tabs/KS_nav_views.png',
		window: controlsWin
	});
	controlsWin.containingTab = controlsTab;
	self.addTab(controlsTab);

	self.setActiveTab(1);

	self.addEventListener('close', function(e) {
		if (e.source == self){
			if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
				self.open();
			}
		}
	});

	return self;
};

module.exports = ApplicationTabGroup;
