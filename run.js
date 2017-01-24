'use strict';

const
	Setup = require('./lib/setup_appium.js'),
	Help = require('./lib/help_run.js'),
	ConfigServer = require('./test_config.js').server;

const
	Mocha = require('mocha'),
	Program = require('commander');

/*
	NOTE: this is not explicitly stated in commander docs, but the angle brackets
	need to be specified in the flags argument, i.e. <suites>, in order to get the
	argument value passed to the script.
*/
Program
	.option('--suites <suites>', 'comma-delimited string of valid test suites; otherwise, run all tests')
	.option('--use-sdk <ti_sdk>', 'build all test apps with the specified Titanium SDK')
	.option('--more-logs', 'enables appium logging; this becomes very noisy')
	.parse(process.argv);

/* jshint -W079 */
const setup = new Setup();

// these will be accessed in the mocha tests
global.driver = setup.appiumServer(ConfigServer);
global.webdriver = setup.getWd();

let
	p = null, // will become a promise chain
	ranAlready = '',
	appiumProc = null; // will be assigned a ChildProcess object

p = new Promise((resolve, reject) => {
	// start the local appium server
	appiumProc = Help.runAppium(ConfigServer, resolve);
});

// the main logic that's running the tests
Help.createTests(Help.transform(Program.suites)).forEach(test => {
	p = p.then(() => {
		console.log(`Installing ${test.cap.app} to ${test.cap.deviceName} ...`);
		return setup.startClient(test.cap, Program.moreLogs);
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
		// sever the connection between the client device and appium server
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