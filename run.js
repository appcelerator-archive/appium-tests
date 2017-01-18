'use strict';

/*
	TODO:

	- config.js should define the appium server to connect to and the different tests per device e.g.
	{
		server: {
			host: localhost,
			port: 4723
		},
		tests: {
			ios: {
				desiredCapabilities: {
					automationName: 'XCUITest',
					noReset: true
				},
				pool: [
					{
						suite: 'Button',
						app: 'Button.app',
						deviceInfo: [
							{
								platformName: 'iOS', (NOTE: don't need this in config.js; sepcify later)
								deviceName: 'iPhone 7 Plus',
								platformVersion: '10.2',
							},
							etc ...
						]
					},
					etc other suites...
				]
			},
			android: {
				etc. same format as ios
			}
		}
	}

	- if running "node run.js", then string all the information together from config.js and run all the tests

	- if running "node run.js <target test>", then will need to lay some rules:
		- <target test> := <Suitefolder>/<platform>.js e.g. Button/ios.js
		- <target test> is relative to the "test" directory; don't need to include test in the parameter
		- <target test> should be comma delimited for multiple suites

	- "test" directory should have the following structure:
			<api_name>/
				<platform1>.js
				<platform2>.js
			<app>/
				<titanium src> or <alloy src>
				<apk/ipa/app>

			for example:
			Button/
				ios.js
				android.js
				windows.js
			ButtonApp/
				AlloyProj/
				ButtonApp.apk
				ButtonApp.app

*/