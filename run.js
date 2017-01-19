'use strict';

const
	Setup = require('./lib/setup_appium.js'),
	Help = require('./lib/help_run.js'),
	TestConfig = require('./test_config.js');

const Mocha = require('mocha');

const setup = new Setup();

// these will be accessed in the mocha tests
global.driver = setup.appiumServer(TestConfig.server);
global.webdriver = setup.getWd();

// argument passed into the script
const arg = process.argv[2];
if (arg) {
	const
		suitePaths = Help.createSuitePaths(arg),
		suitePlatformPairs = Help.createSPs(suitePaths),
		desires = Help.createDesires(suitePlatformPairs, TestConfig.tests);

	let p = Promise.resolve();
	desires.forEach(cap => {
		p = p.then(() => {
			return setup.startClient(cap, true);
		})
		.then(() => {
			return new Promise((resolve, reject) => {
				setTimeout(resolve, 1000);
			});
		})
		.then(() => {
			return setup.stopClient();
		});
	});
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