var getSkipLabel = require('utility').getSkipLabel;


//
// Add the titles of the test cases to the list to get them loaded to the table view
//
exports.createData = function() {
    var acceptanceData = [
        // {title:'TIMOBXXXX', hasChild:true, level:"acceptance"},
        {
            title: 'TIMOB2020',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB5803',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB5989',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB6644',
            hasChild: true,
            level: 'acceptance'
        }, {
            title: 'TIMOB7034',
            hasChild: true,
            level: 'acceptance'
        }, {
            title: 'TIMOB7555',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB8936',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB9055',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB9166',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB9560',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB10038',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB10153',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB10344',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB10346',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB10806',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB11487',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB11295',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB11593',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB12397',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB13544',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB13695',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB15374',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB12993',
            hasChild: true,
            level: "acceptance"
        }, {
            title: 'TIMOB5516',
            hasChild: true,
            level: "acceptance"
        }
    ];

    return acceptanceData;
};

//
// TIMOB-XXXX
// JIRA Issue title
//
exports.TIMOBXXXX = function(_window) {

    if (!(Ti.Platform.osname == 'ipad' || Ti.Platform.osname == 'iphone')) { // effectively a list of supported platforms
        var label = getSkipLabel();
        _window.add(label);
        return _window;
    }
};
//
// TIMOB-5516
// MobileWeb: Incorrect paddings in Button object
//
exports.TIMOB5516 = function(_window) {

    var b1 = Ti.UI.createButton({
        title: 'Button',
        top: 10,
        left: 10,
        height: 40,
        width: 47,
        backgroundColor: '#888'
    });
    _window.add(b1);
    return _window;

};
//
// TIMOB-12993
// android: button/view layout not consistent between android and iOS
//
exports.TIMOB12993 = function(_window) {

    var _json = {
        "menu": [{
            "name": "Home",
            "link": "../id/home-de-mobile",
            "linktarget": "",
            "type": "html"
        }, {
            "name": "Datenschutz",
            "link": "../id/86AE964D595138D2C12577CA003DF311?open&mobile=1",
            "linktarget": "",
            "type": "html"
        }, {
            "sectionheadline": "www.wirtschaftsrat.de",
            "entries": [{
                "name": "Homepage",
                "link": "../id/home-de",
                "linktarget": "_blank",
                "type": "html"
            }, {
                "name": "50 Jahre Wirtschaftsrat",
                "link": "../id/jubilaeum-de",
                "linktarget": "_blank",
                "type": "html"
            }]
        }]
    };

    var buttons = [];
    //var _window = Ti.UI.createWindow();

    var menuWindow = Ti.UI.createView({
        top: 41,
        layout: "vertical",
        zIndex: 5000,
        visible: true
    });

    var menuScrollView = Ti.UI.createScrollView({
        backgroundColor: "#ccc",
        scrollType: "vertical",
        layout: "vertical",
        zIndex: 100
    });

    for (x in _json.menu) {
        if (typeof(_json.menu[x].sectionheadline) == "undefined") {

            buttons[x] = Ti.UI.createButton({
                title: _json.menu[x].name,
                link: _json.menu[x].link,
                target: _json.menu[x].linktarget,
                type: _json.menu[x].type,
                width: "100%",
                height: 50,
                // top : x * 50,
                left: 0,
                top: 0,
                color: "#222",
                zIndex: 102
            });

            buttons[x].addEventListener("click", function(e) {

            });

            menuScrollView.add(buttons[x]);
        } else if (typeof(_json.menu[x].sectionheadline) != "undefined") {
            var sectiontitle = Ti.UI.createLabel({
                height: 50,
                top: 0,
                color: "#000",
                text: _json.menu[x].sectionheadline
            });

            var sectionView = Ti.UI.createView({
                height: 50
            });
            sectionView.add(sectiontitle);
            menuScrollView.add(sectionView);

            var y = x;
            for (var z in _json.menu[x].entries) {
                y++;

                buttons[y] = Ti.UI.createButton({
                    title: _json.menu[x].entries[z].name,
                    link: _json.menu[x].entries[z].link,
                    target: _json.menu[x].entries[z].linktarget,
                    type: _json.menu[x].entries[z].type,
                    width: "100%",
                    height: 50,
                    top: 0,
                    left: 0,
                    color: "#222",
                    zIndex: 102
                });

                buttons[y].addEventListener("click", function(e) {

                });

                menuScrollView.add(buttons[y]);
            }

        }
    }

    menuWindow.add(menuScrollView);

    _window.add(menuWindow);
    return _window;

};
//
// TIMOB-15374
// Add button.disabledColor property
//
exports.TIMOB15374 = function(_window) {

    if (!(Ti.Platform.osname == 'ipad' || Ti.Platform.osname == 'iphone')) { // effectively a list of supported platforms
        var label = getSkipLabel();
        _window.add(label);
        return _window;
    }

    var container = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: 'vertical'
    });

    _window.add(container);

    var isenabled = true;

    var b1 = Ti.UI.createButton({
        title: 'I AM ENABLED',
        color: 'black',
        backgroundImage: 'red.png',
        backgroundSelectedImage: 'green.png',
        backgroundDisabledImage: 'gray.png',
        selectedColor: 'white',
        disabledColor: 'yellow',
        top: 10,
        enabled: isenabled,
        width: 200
    });

    var b2 = Ti.UI.createButton({
        title: 'TOGGLE ENABLED',
        top: 10
    });

    container.add(b1);
    container.add(b2);

    b2.addEventListener('click', function(e) {
        if (isenabled == true) {
            b1.enabled = false;
            b1.title = 'I AM DISABLED';
        } else {
            b1.enabled = true;
            b1.title = 'I AM ENABLED';
        }

        isenabled = !isenabled;
    });

    return _window;
};

//
// TIMOB-13544
// TiAPI: bubbleParent property not being set properly on both iOS and Android
//

exports.TIMOB13544 = function(_window) {
    var button1 = Ti.UI.createButton({
        bubbleParent: false,
        top: 10,
        title: 'Click me to set bubble parent as true'
    });
    var lbl = Ti.UI.createLabel({
        text: 'Bubble Parent Test'
    });

    lbl.text = 'Initially button1 is set as BubbleParent = ' + button1.getBubbleParent();

    button1.addEventListener('click', function(e) {
        button1.setBubbleParent(true);
        lbl.text = 'Now button1 is set as BubbleParent = ' + button1.getBubbleParent();
    });

    _window.add(button1);
    _window.add(lbl);
    return _window;
};

//
// TIMOB-11593
// Android: button border visible when button is set to invisible
//

exports.TIMOB11593 = function(_window) {
    _window.backgroundColor = 'white';
    var btn = Ti.UI.createButton({
        title: "Click Me",
        borderWidth: '2px',
        visible: true,
        borderColor: "red"
    });
    var lbl = Ti.UI.createLabel({
        text: 'Buttons Border must not be visible.',
        visible: false
    });
    btn.addEventListener('click', function(e) {
        btn.visible = false;
        lbl.visible = true;
    });
    _window.add(lbl);
    _window.add(btn);
    return _window;
};

//
// TIMOB-13695
// iOS: backgroundLeftCap not stretching a single pixel, but stretching everything to the right of the left cap uniformly
//

exports.TIMOB13695 = function(_window) {

    if (!(Ti.Platform.osname == 'ipad' || Ti.Platform.osname == 'iphone')) { // effectively a list of supported platforms
        var label = getSkipLabel();
        _window.add(label);

    } else {
        var selectMenuButton = Ti.UI.createButton({
            left: 35,
            right: 45,
            height: 31,
            backgroundImage: "/arrow_down.png",
            backgroundLeftCap: 1
        });
        _window.add(selectMenuButton);
    }
    return _window;
};

//
// TIMOB-10346
// iOS: Implement applyProperties({}) method on Ti.UI objects to take a list of json properties as is done at create time.
//

exports.TIMOB10346 = function(_window) {

    var btn = Ti.UI.createButton({
        left: 10,
        top: 10,
        width: 100,
        height: 40,
        title: 'Tap Me!'
    });
    btn.addEventListener('click', function(e) {
        btn.applyProperties({
            width: 200,
            height: 100,
            title: 'I Was Tapped!'
        });
    });
    _window.add(btn);
    return _window;
};

//
// TIMOB-9560
// Button with width auto or undefined does not work with image and title defined
//
exports.TIMOB9560 = function(_window) {

    var btn1 = Ti.UI.createButton({
        title: 'Via call',
        top: 200,
        height: 50
    });
    var btn2 = Ti.UI.createButton({
        title: 'Via apply',
        top: 350,
        height: 50
    });
    var al1 = btn1.addEventListener;
    al1.call(btn1, 'click', function(e) {
        alert('clicked button 1');
    });
    var al2 = btn2.addEventListener;
    al2.apply(btn2, ['click',
        function(e) {
            alert('clicked button 2');
        }
    ]);
    _window.add(btn1);
    _window.add(btn2);

    return _window;

};
//
// TIMOB-11295
// Button with width auto or undefined does not work with image and title defined
//
exports.TIMOB11295 = function(_window) {
    var expected = Ti.UI.createButton({
        title: 'TEST',
        image: 'KS_nav_ui.png',
        width: Ti.UI.SIZE,
        top: 10
    });

    var fail1 = Ti.UI.createButton({
        title: 'TEST',
        image: 'KS_nav_ui.png',
        width: 'auto',
        top: 60
    });

    var fail2 = Ti.UI.createButton({
        title: 'TEST',
        image: 'KS_nav_ui.png',
        top: 110
    });

    _window.add(expected);
    _window.add(fail1);
    _window.add(fail2);
    return _window;

};

//
// TIMOB-10344 Android: Implement applyProperties({}) method on Ti.UI objects to take a list of json properties as is done at create time.
//
exports.TIMOB10344 = function(win) {

    win.backgroundColor = 'white';
    win.open();

    var btn = Ti.UI.createButton({
        left: 10,
        top: 10,
        width: 100,
        height: 40,
        title: 'Tap Me!'
    });
    btn.addEventListener('click', function(e) {
        btn.applyProperties({
            width: 200,
            height: 100,
            title: 'I Was Tapped!'
        });
    });
    win.add(btn);

    return win;
};

//
// TIMOB-8936 iOS: Using backgorund gradient results in Error Adding an event listener to a proxy that isn't already in the context
//
exports.TIMOB8936 = function(_window) {

        _window.backgroundColor = 'white';

        var buttonAddFav = Titanium.UI.createButton({
            title: 'add2favs',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#111',
            backgroundImage: 'none',
            backgroundGradient: {
                type: 'linear',
                colors: ['#aaa', '#f00']
            },
            height: 40,
            width: 200,
            top: 10,
            bottom: 10
        });

        _window.add(buttonAddFav);

        return _window;
    }
    //
    // TIMOB-5989
    // Button's image attribute behaves the same as the backgroundImage attribute
exports.TIMOB5989 = function(_window) {

        _window.backgroundColor = '#fff';
        _window.title = 'Win 1';

        var button = Titanium.UI.createButton({
            top: 60,
            title: 'Hello',
            width: '180',
            height: '80',
            //backgroundImage : 'KS_nav_ui.png',
            image: 'KS_nav_ui.png',
            //    backgroundLeftCap:12,
            //    backgroundTopCap:12,
            //    textAlign: Titanium.UI.TEXT_ALIGNMENT_RIGHT
        });

        _window.add(button);

        return _window;
    }
    //
    // TIMOB-9055 tests that the text in a button is centered vertically and horizontally
    //
exports.TIMOB9055 = function(_window) {

    var logoutButton = Ti.UI.createButton({
        title: 'Logout',
        backgroundColor: 'orange',
        //backgroundImage:'none',
        width: 60,
        height: 40,
        top: 100,
        font: {
            fontSize: 12,
            fontfamily: 'Helvetica Neue',
            fontWeight: 'bold'
        }
    });

    _window.add(logoutButton);

    return _window;
}

exports.TIMOB5803 = function(_window) {
    var button = Titanium.UI.createButton({
        height: 60,
        width: 80,
        backgroundImage: 'slightlylargerimage.png'
    });

    _window.add(button);

    button.addEventListener('click', function() {
        alert('clicking');
    })

    return _window;
};

exports.TIMOB2020 = function(_window) {
	if (Ti.Platform.osname !== 'iphone' && Ti.Platform.osname !== 'ipad') {
		_window.add(getSkipLabel());
		return _window;
	}

    var goal = Math.floor(Math.random() * 21) + 10;

    // Create the 3 solution numbers which add up to the goal.
    // We do this to guarantee that a solution exists.
    // These will be randomized in position when assigned to buttons.
    var solutionValue = [];
    solutionValue[0] = Math.floor(Math.random() * (goal - (goal / 2) - 1)) + 1;
    solutionValue[1] = Math.floor(Math.random() * (goal - (goal / 2) - 1)) + 1;
    solutionValue[2] = goal - (solutionValue[0] + solutionValue[1]);

    // Create 9 additional potentially irrelevant numbers. They
    // might lead to a solution, or they might not. From the logic
    // just above, we are guaranteed to have 3 numbers that add up
    // to the goal.

    for (var i = 3; i < 12; i++) {
        solutionValue[i] = Math.floor(Math.random() * (goal - (goal / 2) - 1)) + 1;
    }
    Titanium.API.info("Goal: " + goal);
    for (i = 0; i < 12; i++) {
        Titanium.API.info("Solution " + i + ": " + solutionValue[i]);
    }

    // Create a banner with the goal
    var goalLabel = Titanium.UI.createButton({
        title: goal,
        color: '#fff', // white text
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    });
    _window.add(goalLabel);

    var assigned = [];
    for (i = 0; i < 12; i++) {
        assigned[i] = 0;
    }

    // Create 12 buttons, randomly distributing the solution values among them
    var solutionButton = [];
    for (i = 0; i < 12; i++) {
        // Compute an index from 0 to 11
        var valueIndex = Math.floor(Math.random() * 12);
        if (valueIndex == 12) {
            valueIndex = 11;
        }

        // Assign this index, or take the next available one
        while (assigned[valueIndex] == 1) {
            valueIndex += 1;
        }
        assigned[valueIndex] = 1;

        Titanium.API.info("Creating a button ...");
        solutionButton[i] = Titanium.UI.createButton({
            title: solutionValue[valueIndex],
            style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
        });
    }

    Titanium.API.info("All buttons created");

    var flexSpace = Titanium.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });

    // Assemble the 12 buttons into 4 rows of 3 buttons each
    var toolbar = [];
    for (i = 0; i < 4; i++) {
        Titanium.API.info("Creating a toolbar ...");

        toolbar[i] = Titanium.UI.iOS.createToolbar({
            items: [solutionButton[i], flexSpace, solutionButton[i + 1], flexSpace, solutionButton[i + 2]],
            top: 40 * i,
            borderTop: false,
            borderBottom: true
        });
        _window.add(toolbar[i]);
    }

    return _window;
};

//
// TIMOB-7034 tests that when setting both backgroundImage and backgroundSelectedImage
// the white feedback from the touch is disabled
//
exports.TIMOB7034 = function(_window) {

    var button = Ti.UI.createButton({
        width: 207,
        height: 80,
        top: 0,
        left: 0,
        backgroundColor: '#000',
        color: '#000',
        backgroundSelectedImage: 'testButton2.png',
        backgroundImage: 'testButton.png',
    });

    button.addEventListener('click', function() {
        Ti.API.info('clicked button');
    });

    _window.add(button);

    return _window;
};

//
// TIMOB-6644 iOS: Button - setting backgroundImage causes the button not provide visual feedback when it is clicked
//

exports.TIMOB6644 = function(_window) {

    var share = Ti.UI.createButton({
        //title: 'Share',
        top: 50,
        left: 50,
        width: 130,
        height: 35,
        backgroundImage: 'share.png'
    });

    var share1 = Ti.UI.createButton({
        title: 'No Image',
        top: 100,
        left: 50,
        width: 130,
        height: 50
    })

    _window.add(share);
    _window.add(share1);

    return _window;
};

//
// TIMOB-7555
// iOS: Titanium.UI.Button: touchmove event fails to fire
//
exports.TIMOB7555 = function(_window) {

    var win = _window;
    var button = Ti.UI.createButton({
        top: '10%',
        bottom: '10%',
        left: '10%',
        right: '10%'
    });

    button.addEventListener('touchmove', function() {
        Ti.API.info('touchmove fired');
        button.title = 'touchmove fired'
    });
    button.addEventListener('touchstart', function() {
        Ti.API.info('touchstart fired');
        button.title = 'touchstart fired'
    });
    button.addEventListener('touchend', function() {
        Ti.API.info('touchend fired');
        button.title = 'touchend fired'
    });

    win.add(button);

    return _window;
};

//
// TIMOB-9166 iOS: Button background image scaling issues when button height is smaller than its background image
//

exports.TIMOB9166 = function(_window) {

        // this sets the background color of the master UIView (when there are no windows/tab groups on it)
        Titanium.UI.setBackgroundColor('#000');

        _window.title = 'Tab 1';
        _window.backgroundColor = '#fff';
        _window.layout = "vertical";

        // button-background.png is 39x37

        var button1 = Ti.UI.createButton({
            top: 0,
            left: 0,
            height: 34,
            width: 106,
            backgroundImage: "button-background.png",
            backgroundTopCap: 15,
            backgroundLeftCap: 15,
            backgroundRepeat: false,
            color: "#000000",
            font: {
                "fontSize": 14,
                "fontWeight": "bold",
                "fontFamily": "Helvetica Neue"
            },
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
            title: "106x34"
        });

        var button2 = Ti.UI.createButton({
            top: 50,
            left: 0,
            height: 37,
            width: 106,
            backgroundImage: "button-background.png",
            backgroundTopCap: 15,
            backgroundLeftCap: 15,
            backgroundRepeat: false,
            color: "#000000",
            font: {
                "fontSize": 14,
                "fontWeight": "bold",
                "fontFamily": "Helvetica Neue"
            },
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
            title: "106x37"
        });

        _window.add(button1);
        _window.add(button2);

        return _window;
    }
    //
    // TIMOB-10038: Ti.UI.ImageView.opacity doesn't seem to have any effect
    //
exports.TIMOB10038 = function(_window) {

    _window.layout = 'vertical';
    _window.backgroundColor = 'white';

    var view1 = Ti.UI.createView({
        backgroundColor: 'white',
        height: 200,
        top: 10,
        width: Ti.UI.SIZE,
        // width: 'auto',
        layout: 'horizontal'
    });

    var createButton = function(imagePath) {
        var button = Ti.UI.createButton({
            image: imagePath,
            style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
            height: 70,
            width: 70,
            left: 10,
            borderWidth: '0',
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            opacity: 0.3
        });

        button.addEventListener('click', function(e) {
            if (button.opacity >= 1)
                button.opacity = 0.3;
            else
                button.opacity = 1;
        });

        return button;
    };

    var sadButton4 = createButton('TIMOB10038/face_sad.png');
    var okButton4 = createButton('TIMOB10038/face_ok.png');
    var happyButton4 = createButton('TIMOB10038/face_happy.png');

    view1.add(sadButton4);
    view1.add(okButton4);
    view1.add(happyButton4);
    _window.add(view1);

    var view2 = Ti.UI.createView({
        backgroundColor: 'white',
        height: 200,
        width: Ti.UI.SIZE,
        layout: 'horizontal'
    });

    var sadButton = Ti.UI.createButton({
        image: 'TIMOB10038/face_sad.png',
        title: 'Sad',
        left: 10,
        height: 100,
        width: 100,
        borderWidth: '0',
        borderColor: 'transparent',
        backgroundColor: 'blue',
        opacity: 0.3
    });

    sadButton.addEventListener('click', function(e) {
        if (sadButton.opacity >= 1)
            sadButton.opacity = 0.3;
        else
            sadButton.opacity = 1;
    });

    var sadButton2 = Ti.UI.createButton({
        image: 'TIMOB10038/face_sad.png',
        title: 'Sad 2',
        left: 10,
        height: 100,
        width: 100,
        borderWidth: '10',
        borderColor: 'red',
        backgroundColor: 'transparent',
        opacity: 0.3
    });

    sadButton2.addEventListener('click', function(e) {
        if (sadButton2.opacity >= 1)
            sadButton2.opacity = 0.3;
        else
            sadButton2.opacity = 1;
    });

    var happyButton = Ti.UI.createButton({
        backgroundImage: 'TIMOB10038/face_happy.png',
        title: 'Happy',
        left: 10,
        height: 100,
        width: 100,
        borderWidth: '0',
        borderColor: 'transparent',
        backgroundColor: 'blue',
        opacity: 0.3
    });

    happyButton.addEventListener('click', function(e) {
        if (happyButton.opacity >= 1)
            happyButton.opacity = 0.3;
        else
            happyButton.opacity = 1;
    });

    var happyButton2 = Ti.UI.createButton({
        backgroundImage: 'TIMOB10038/face_happy.png',
        title: 'Happy 2',
        left: 10,
        height: 100,
        width: 100,
        borderWidth: '10',
        borderColor: 'red',
        backgroundColor: 'transparent',
        opacity: 0.3
    });

    happyButton2.addEventListener('click', function(e) {
        if (happyButton2.opacity >= 1)
            happyButton2.opacity = 0.3;
        else
            happyButton2.opacity = 1;
    });

    view2.add(sadButton);
    view2.add(sadButton2);
    view2.add(happyButton);
    view2.add(happyButton2);

    _window.add(view2);

    return _window;

};

//
// TIMOB-10153: Android: Button: Touchend event not fired when touchmove gesture moves out of button
//

exports.TIMOB10153 = function(_window) {

        var button = Ti.UI.createButton({
            top: '10%',
            bottom: '10%',
            left: '10%',
            right: '10%',
        });

        button.addEventListener('touchmove', function() {
            Ti.API.info('touchmove fired');
            button.title = 'touchmove fired'
        });
        button.addEventListener('touchstart', function() {
            Ti.API.info('touchstart fired');
            button.title = 'touchstart fired'
        });
        button.addEventListener('touchend', function() {
            Ti.API.info('touchend fired');
            button.title = 'touchend fired'
        });

        _window.add(button);

        return _window;
    }
    //
    // TIMOB-11487: Text of the button spills over to the parent view if its too long
    //
exports.TIMOB11487 = function(_window) {

    _window.backgroundColor = 'white';

    var label = Ti.UI.createLabel({
        text: 'Buttons should auto size to text, but stay within red',
        top: 20,
        left: 10,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: 'black'
    });

    var outlineView3 = Ti.UI.createView({
        height: 62,
        width: 152,
        top: 280,
        backgroundColor: 'red'
    });
    var view3 = Ti.UI.createView({
        height: 60,
        width: 150
    });
    var button3 = Ti.UI.createButton({
        title: 'VeryLongButtonText1234567890 '
    });
    view3.add(button3);
    outlineView3.add(view3);

    _window.add(label);
    _window.add(outlineView3);
    return _window;
};
//
// TIMOB-12397 IOS: Label inside a button does not show
//
exports.TIMOB12397 = function(win) {

    win.backgroundColor = 'white';
    win.open();

    var button = Ti.UI.createButton({
        width: 200,
        height: 200,
        enabled: true,
        backgroundImage: "blue.png",
        backgroundColor: "red"
    })

    var btnLabel = Ti.UI.createLabel({
        text: "I am button",
        backgroundColor: "green"
    })

    button.add(btnLabel);

    win.add(button);
    return win;
};

//
// TIMOB-10806 Android: Ti.UI.Button.image property is not working for density specific images
//
exports.TIMOB10806 = function(win) {

    win.backgroundColor = 'white';
    win.open();

    var button = Ti.UI.createButton({
		top: 50,
	    left: 20,
	    width: 100,
	    height: 50,
	    image: '/images/Tab1.png',
	    title: 'Hello'
	});

	button.addEventListener('click', function() {
		button.image = 'KS_nav_ui.png';
	});

	win.add(button);
    return win;
};