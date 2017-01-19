'use strict';

const
	driver = global.driver,
	webdriver = global.webdriver;

// before('suite setup', function () {
// 	// the webdriver takes a while to setup; mocha timeout is set to 5 minutes
// 	this.timeout(300000);
//
// 	driver = s.appiumServer({
// 		host: 'localhost',
// 		port: 4723
// 	}, false);
//
// 	webdriver = s.getWd();
//
// 	// specify target test app and ios simulator
// 	return s.startClient({
// 		automationName: 'XCUITest',
// 		platformName: 'iOS',
// 		deviceName: 'iPhone 7 Plus',
// 		platformVersion: '10.2',
// 		app: '/Users/wluu/github/qe-appium/KitchenSink/build/iphone/build/Products/Debug-iphonesimulator/KitchenSink.app',
// 		noReset: true // doesn't kill the simulator
// 	});
// });
//
// after('suite teardown', function () {
// 	return s.stopClient();
// });

// Controls > Slider > Basic
describe('KS iOS Slider', function () {
	// in general, the tests take a while to go through, which will hit mocha's 2 second timeout threshold.
	// set timeout to 5 minutes
	this.timeout(300000);

	it('should change basic slider', function () {
		return driver
			.elementByName('Slider')
			.click()
			.waitForElementByName('Basic', webdriver.asserters.isDisplayed) // used when waiting for elements: https://github.com/admc/wd/#waiting-for-something
			.click()
			.waitForElementByName('Change Basic Slider', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Basic Slider - value = 2 act val 2', webdriver.asserters.isDisplayed);
	});

	it('should drag the scrubber on the slider to the right', function () {
		// https://github.com/admc/wd/blob/master/test/specs/mjson-actions-specs.js

		const dragToRight = new webdriver.TouchAction()
			.press({x:139, y:108}) // press on the scrubber location
			.moveTo({x:100, y:0}) // drag scrubber to the right
			.release(); // release the scrubber

		return driver
			.performTouchAction(dragToRight)
			.waitForElementByName('Basic Slider - value = 6 act val 6', webdriver.asserters.isDisplayed);
	});

	it('go back to beginning of app', function () {
		return driver
			.elementByName('Slider')
			.click()
			.elementByName('Controls')
			.click();
	});
});