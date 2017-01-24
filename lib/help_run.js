'use strict';

const ConfigTests = require('../test_config.js').tests;

const
	path = require('path'),
	fs = require('fs'),
	spawn = require('child_process').spawn;

const TEST_DIR = 'tests';

class Helper {
	/*
		starts and run the local appium server.

		@param {Object} server - the server property from test_config.js
		@param {Function} cb - the callback to call when the server is up and running
		@return {ChildProcess} - returns a ChildProcess to be killed later
	*/
	static runAppium(server, cb) {
		const
			cmd = path.join(__dirname, '..', 'node_modules', '.bin', 'appium'),
			flags = ['--log-no-colors']; // no colors from the appium server

		const appiumProc = spawn(cmd, flags);

		appiumProc.stdout.on('data', output => {
			const LINE = output.toString().trim();

			const
				REG_STR = `started on (0\\.0\\.0\\.0|${server.host})\\:${server.port}$`,
				isRunning = new RegExp(REG_STR, 'g').test(LINE);
			if (isRunning) {
				console.log(`Local Appium server started on ${server.host}:${server.port}`);
				cb();
			}

			const isShutDown = '[Appium] Received SIGTERM - shutting down' === LINE;
			if (isShutDown) {
				console.log('Appium server shutting down ...');
			}
		});

		appiumProc.stderr.on('data', output => {
			console.log(output.toString());
		});

		appiumProc.on('exit', () => {
			console.log('DONE');
		});

		return appiumProc;
	}

	/*
		given the suite argument (--suites), validate them and convert the
		comma-delimited string into a useful data structure.

		if --suites flag is not used, then create the comma-delimited string from
		all the test suites.

		@param {String} suiteArg - a comma delimited string of valid test suites
		@return {Array} - array of json objects; the object properies are defined as:
			{
				abs: absolute path to the test suite in the TEST_DIR,
				name: the name of the test suite,
				platform: the target platform that the test suite is tested against
			}
	*/
	static transform(suiteArg) {
		const suites = [];

		if (!suiteArg) {
			suiteArg = '';

			for (let platform in ConfigTests) {
				for (let suite in ConfigTests[platform]) {
					// ignore 'desiredCapabilities'; it's not a suite
					if (suite !== 'desiredCapabilities') {
						suiteArg += `${suite}${path.sep}${platform}.js,`;
					}
				}
			}

			// remove the last comma
			suiteArg = suiteArg.slice(0, suiteArg.length - 1);
		}

		const files = suiteArg.split(',');
		files.forEach(file => {
			// checks if the suites exist in the TEST_DIR directory.
			try {
				fs.statSync(path.join(TEST_DIR, file));
			}
			catch (err) {
				console.log(`'${file}' doesn't exist in '${TEST_DIR}' directory.`);
				process.exit(1);
			}

			const
				parts = file.split(path.sep), // separate path by system's file separator
				suite = parts[0],
				platformFile = parts[1];

			const
				extensionIndex = platformFile.length - '.js'.length,
				platform = platformFile.slice(0, extensionIndex);

			// simple check if platform is supported
			switch (platform) {
				case 'ios':
				case 'android':
				case 'windows':
					// these are valid platforms; do nothing
				break;

				// if there is invalid platform, stop the script
				default:
					console.log(`${file}: '${platform}' is not a valid platform.`);
					process.exit(1);
			}

			suites.push({
				abs: _makeAbs(file),
				name: suite,
				platform: platform
			});
		});

		return suites;
	}

	/*
		@param {Array} suites -
		@param {String} tiSdk -
		@param {Function} cb -
	*/
	static buildTestApps(suites, tiSdk, cb) {
		// check if there is tiSdk; otherwise, call cb

		// will need to do a promise chain
		suites.forEach(targetSuite => {
			const tiProj = ConfigTests[targetSuite.platform][targetSuite.name].proj;
			// need to modify and save the tiapp.xml
			// use ChildProcess to build (only) the titanium project by platform; no trace logs or colors
		});
		cb();
	}

	/*
		using the suite data structure from transform() method, generate a list of mocha suite
		and appium capabilities pair.

		@param {Array} suites - the data structure returned from transform() method
		@return {Array} - an array of json objects; the object properies are defined as:
		 	{
				suite: absolute path to the test suite in the TEST_DIR,
				cap: valid appium's capabilities; https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/default-capabilities-arg.md
			}
	*/
	static createTests(suites) {
		const listOfTests = [];

		suites.forEach(targetSuite => {
			const
				tests = ConfigTests[targetSuite.platform],
				desiredCap = tests.desiredCapabilities,
				configSuite = tests[targetSuite.name];

			const tiBuildDir = path.join(targetSuite.name, configSuite.proj, 'build');

			switch (targetSuite.platform) {
				case 'ios':
					desiredCap.platformName = 'iOS';

					// appium needs an absolute path to the specified built mobile app (simulator only for now)
					const iosApp = path.join(tiBuildDir, 'iphone', 'build', 'Products', 'Debug-iphonesimulator', `${configSuite.proj}.app`);
					desiredCap.app = _makeAbs(iosApp);
				break;

				case 'android':
					desiredCap.platformName = 'Android';

					// for android, appium requires these two properties
					desiredCap.appPackage = configSuite.appPackage;
					desiredCap.appActivity = configSuite.appActivity;

					// appium needs an absolute path to the specified built mobile app
					const androidApk = path.join(tiBuildDir, 'android', 'bin', `${configSuite.proj}.apk`);
					desiredCap.app = _makeAbs(androidApk);
				break;

				case 'windows':
					// NOTE: don't know the actually appium value
					desiredCap.platformName = 'Windows';
				break;
			}

			// it is possible for a test suite to have multiple target test devices
			configSuite.testDevices.forEach(device => {
				// Object.assign() makes a shallow copy (propertry and values only) of desiredCap object
				const newDesires = Object.assign({}, desiredCap);
				newDesires.deviceName = device.deviceName;
				newDesires.platformVersion = device.platformVersion;

				listOfTests.push({
					suite: targetSuite.abs,
					cap: newDesires
				});
			});
		});

		return listOfTests;
	}
}

module.exports = Helper;

/*
	an internal method to create an absolute path to a file in the TEST_DIR

	@param {String} file - a file relative to TEST_DIR
	@return {String} - an absolute path to a file in the TEST_DIR
*/
function _makeAbs(file) {
	return path.join(__dirname, '..', TEST_DIR, file);
}