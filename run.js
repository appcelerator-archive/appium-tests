'use strict';

const
	Setup = require('./lib/setup_appium.js'),
	Help = require('./lib/help_run.js'),
	TestConfig = require('./test_config.js');

const Mocha = require('mocha');

/* jshint -W079 */
const setup = new Setup();

// these will be accessed in the mocha tests
global.driver = setup.appiumServer(TestConfig.server);
global.webdriver = setup.getWd();

// argument passed into the script
const arg = process.argv[2];
if (arg) {
	const tests = Help.createTests(arg, TestConfig.tests);

	let ranAlready = '';

	let p = Promise.resolve();
	tests.forEach(test => {
		p = p.then(() => {
			return setup.startClient(test.cap, true);
		})
		.then(() => {
			return new Promise((resolve, reject) => {
				// grrrrr, can't run the same test suite twice in mocha; need to apply this workaround
				// https://github.com/mochajs/mocha/issues/995
				if (ranAlready === test.suite) {
					Object.keys(require.cache).forEach(file => {
						// seems safe: http://stackoverflow.com/a/11477602
						delete require.cache[file];
					});
				}
				ranAlready = test.suite;

				new Mocha({
					useColors: false,
					fullStackTrace: true
				})
				.addFile(test.suite)
				.run(failures => {
					resolve();
				});
			});
		})
		.then(() => {
			return setup.stopClient();
		})
		.catch(err => {
			console.log(err.stack);
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