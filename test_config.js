'use strict';

module.exports = {
	// the appium server you want to talk to
	server: {
		host: 'localhost',
		port: 4723
	},

	// collection of tests from the tests/ directory
	// NOTE: as this grows, probably should put this in a proper database
	tests: {
		ios: {
			// valid appium properties from https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/default-capabilities-arg.md
			desiredCapabilities: {
				automationName: 'XCUITest',
				noReset: true
			},
			Slider: {
				proj: 'KitchenSink',
				testDevices: [
					// these are simulators
					{
						deviceName: 'iPhone 7 Plus',
						platformVersion: '10.2'
					},
					{
						deviceName: 'iPhone 7',
						platformVersion: '10.1'
					}
				]
			}
		},

		android: {
			desiredCapabilities: {
				automationName: 'Appium',
				noReset: true
			},
			Slider: {
				proj: 'KitchenSink',
				appPackage: 'com.appcelerator.kitchensink',
				appActivity: '.KitchensinkActivity',
				testDevices: [
					{
						// genymotion emulator
						deviceName: 'Custom Phone - 7.0.0 - API 24 - 768x1280',
						platformVersion: '7.0'
					}
				]
			}
		}
	}
};