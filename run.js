'use strict';

const
	Setup = require('./lib/setup.js'),
	TestConfig = require('./test_config.js');

// argument passed into the script
const arg = process.argv[2];
if (arg) {
	/*
		- if running "node run.js <target test>", then will need to lay some rules:
			- <target test> := <Suitefolder>/<platform>.js e.g. Button/ios.js
			- <target test> is relative to the "test" directory; don't need to include test in the parameter
			- <target test> should be comma delimited for multiple suites
	*/
}
else if (arg === undefined) {
	// if running "node run.js", then string all the information together from config.js and run all the tests
}

/*
	TODO: start appium server in the background

	start loop of specified tests
		TODO: build associated test app with specified sdk
		start the setup
		run target test
*/