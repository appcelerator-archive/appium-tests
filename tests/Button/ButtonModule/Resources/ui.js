exports.createApplicationTabGroup = function() {
    var tabGroup = Titanium.UI.createTabGroup();

    var acceptance = createWindow('Acceptance');
    var about = createWindow('About');

    var acceptanceTab = Titanium.UI.createTab({
        title : 'Acceptance',
        window : acceptance
    });

    var aboutTab = Titanium.UI.createTab({
    title : 'About',
        window : about
    });

    tabGroup.addTab(acceptanceTab);
    tabGroup.addTab(aboutTab);

    return tabGroup;
};

// create the individual window for each tab
function createWindow(_level) {
    var win = Titanium.UI.createWindow({
        title : _level,
        backgroundColor : 'white'
    });

    switch(_level) {
        case 'About':
            var data = '';
            data += 'ID: ' + Titanium.App.getId() + '\n';
            data += 'Name: ' + Titanium.App.getName() + '\n';
            data += 'Version: ' + Titanium.App.getVersion() + '\n';
            data += 'Publisher: ' + Titanium.App.getPublisher() + '\n';
            data += 'URL: ' + Titanium.App.getUrl() + '\n';
            data += 'Description: ' + Titanium.App.getDescription() + '\n';
            data += 'Copyright: ' + Titanium.App.getCopyright() + '\n';
            data += 'GUID: ' + Titanium.App.getGuid() + '\n';
            data += 'Build: ' + Titanium.version + '.' + Titanium.buildHash + ' (' + Titanium.buildDate + ')\n';
            data += 'Display caps density:' + Titanium.Platform.displayCaps.density + '\n';
            data += 'Platform: ' + Titanium.Platform.name + '\n';
            data += 'Model: ' + Ti.Platform.model + '\n';
            data += 'OS Name: ' + Ti.Platform.osname;

            var label = Titanium.UI.createLabel({
                text : data,
                color: 'black',
                top : 10,
                textAlign : 'left',
                width : 'auto',
                height : 'auto'
            });

            win.add(label);
        break;

        case 'Acceptance':
            win.add(createTableView(_level));
        break;
    }

    return win;
}

// start popluating the table with test cases
var at = require('acceptance');

function createTableView(_level) {
    var done = Titanium.UI.createButton({
        title:"Done",
        bottom: 0,
        right: 5
    });

    var tableView = Ti.UI.createTableView();

    // populate the rows with test cases
    if (_level == 'Acceptance') {
        var testCases = at.createData();
        tableView.setData(testCases);
    }

    // launch each test case when selected
    tableView.addEventListener('click', function(_e) {
        var win = createTestCase(_e.rowData);
        win.add(done);
        done.addEventListener('click', function() {
            win.close();
        });
        win.open();
    });

    return tableView;
}

// execute the test case
function createTestCase(_rowData) {
    var detailWindow = Ti.UI.createWindow({
        title:_rowData.title,
        backgroundColor: 'white'
    });

    if (_rowData.level == "acceptance") {
        detailWindow = at[_rowData.title](detailWindow);
    }

    return detailWindow;
}
