'use strict';

const
	Setup = require('./lib/setup_appium.js'),
	Help = require('./lib/help_run.js'),
	TestConfig = require('./test_config.js');

const Mocha = require('mocha');

// argument passed into the script
const suiteArg = process.argv[2];

/* jshint -W079 */
const setup = new Setup();

// these will be accessed in the mocha tests
global.driver = setup.appiumServer(TestConfig.server);
global.webdriver = setup.getWd();

let
	p = null, // will become a promise chain
	ranAlready = '',
	appiumProc = null; // will be assigned a ChildProcess object

p = new Promise((resolve, reject) => {
	appiumProc = Help.runAppium(TestConfig.server, resolve);
});

// the main logic that's running the tests
Help.createTests(suiteArg, TestConfig.tests).forEach(test => {
	p = p.then(() => {
		console.log(`Installing ${test.cap.app} to ${test.cap.deviceName} ...`);
		return setup.startClient(test.cap, false);
	})
	.then(() => {
		return new Promise((resolve, reject) => {
			// grrrrr, can't run the same test suite twice in mocha; need to apply this workaround
			// https://github.com/mochajs/mocha/issues/995
			if (ranAlready === test.suite) {
				for (let file in require.cache) {
					// seems safe: http://stackoverflow.com/a/11477602
					delete require.cache[file];
				}
			}
			ranAlready = test.suite;

			// this is also part of the above workaround
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
	});
});

p.then(() => {
	console.log('Done running tests.');

	// kills the local appium server
	appiumProc.kill();
})
.catch(err => {
	console.log(err.stack);
	process.exit(1);
});

/*
	TODO: start appium server in the background

	start loop of specified tests
		TODO: build associated test app with specified sdk
		start the setup
		run target test
*/