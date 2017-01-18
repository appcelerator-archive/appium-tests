'use strict';

const Setup = require('../helpers/setup.js');

let
	driver = null,
	webdriver = null;

before('suite setup', function () {
	// the webdriver takes a while to setup; mocha timeout is set to 5 minutes
	this.timeout(300000);

	const setup = new Setup();

	webdriver = setup.getWd();

	// appium local server
	driver = webdriver.promiseChainRemote({
		host: 'localhost',
		port: 4723
	});

	// turn on logging for the driver
	setup.logging(driver);

	// specify target test app and ios simulator
	return driver.init({
		automationName: 'Appium',
		platformName: 'Android',
		platformVersion: '6.0',
		deviceName: '192.168.56.101:5555',
		app: '/Users/wluu/github/qe-appium/KitchenSink/build/android/bin/KitchenSink.apk',
		appPackage: 'com.appcelerator.kitchensink',
		appActivity: '.KitchensinkActivity',
		noReset: true // doesn't kill the emulator
	});
});

after('suite teardown', function () {
	return driver.quit();
});

// Controls > Slider > Basic
describe('KS Android Slider', function () {
	// in general, the tests take a while to go through, which will hit mocha's 2 second timeout threshold.
	// set timeout to 5 minutes
	this.timeout(300000);

	it('should change basic slider', function () {
		// https://developer.android.com/reference/android/support/test/uiautomator/UiSelector.html

		return driver
			.elementByAndroidUIAutomator('new UiSelector().text("Slider")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Basic")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Change Basic Slider")')
			.click();
	});

	it('should drag the scrubber on the slider to the right', function () {
		// https://github.com/admc/wd/blob/master/test/specs/mjson-actions-specs.js

		const NEW_TEXT = 'Basic Slider - value = 5 act val 5';

		const DRAG_TO_RIGHT = new webdriver.TouchAction()
			.press({x:244, y:273}) // press on the scrubber location
			.moveTo({x:100, y:0}) // drag scrubber to the right
			.release(); // release the scrubber

		return driver
			.performTouchAction(DRAG_TO_RIGHT)
			.elementByAndroidUIAutomator(`new UiSelector().text("${NEW_TEXT}")`)
			.text().should.become(NEW_TEXT); // this part is redundant; the above command will throw an error if text is not found; left this here as an example
	});

	it('go back to beginning of app', function () {
		return driver
			.back()
			.back();
	});
});