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
	.option('--more-logs', 'enables more logging; this becomes very noisy')
	.parse(process.argv);

/* main */

/* jshint -W079 */
const setup = new Setup();

// these will be accessed in the mocha tests
global.driver = setup.appiumServer(ConfigServer);
global.webdriver = setup.getWd();

let
	ranAlready = '',
	appiumProc = null; // will be assigned a ChildProcess object

// change the comma-delimited value into something useful
const suiteData = Help.transform(Program.suites);

let p = new Promise(resolve => {
	// start the local appium server
	appiumProc = Help.runAppium(ConfigServer, resolve);
})
.then(() => {
	return new Promise(resolve => {
		// build all test apps using the specified titanium sdk
		Help.buildTestApps(suiteData, Program.useSdk, Program.moreLogs, resolve);
	});
});

// the main logic that's running the tests
Help.createTests(suiteData).forEach(test => {
	p = p.then(() => {
		return new Promise((resolve, reject) => {
			if (test.cap.platformName !== 'Android') {
				resolve();
				return;
			}
			// need to launch the genymotion emulator first.
			// appium won't launch it like it does for ios simulators.
			Help.launchGeny(test.cap.deviceName, resolve, reject);
		});
	})
	.then(() => {
		// expose which device is being used to the test suites
		global.curDevice = {
			name: test.cap.deviceName,
			ver: test.cap.platformVersion
		};

		console.log(`Installing ${test.cap.app} to ${test.cap.deviceName} ...`);
		return setup.startClient(test.cap, Program.moreLogs);
	})
	.then(() => {
		return new Promise(resolve => {
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
	})
	.then(() => {
		return new Promise(resolve => {
			if (test.cap.platformName !== 'Android') {
				resolve();
				return;
			}
			// quit the currently running genymotion emulator
			Help.quitGeny(resolve);
		});
	});
});

p.then(() => {
	console.log('Done running tests.');

	// kills the local appium server
	appiumProc.kill();
})
.catch(err => {
	console.log(err.stack);

	appiumProc.kill();
	process.exit(1);
});