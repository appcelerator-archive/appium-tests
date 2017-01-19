'use strict';

const
	path = require('path'),
	fs = require('fs');

const TEST_DIR = 'tests';

class Helper {
	/*
		given the script aguments and configured tests, generate a usable data structure
		to allow the runner to easily start the appium client and run mocha tests.

		@param {Array} args - a comma delimited string of valid test suites
		@param {Object} configTests - the 'tests' object from test_config.js
		@return {Array} - an array of json objects; the object properies are defined as:
		 	{
				suite: absolute path to the test suite in the TEST_DIR,
				cap: valid appium's capabilities; https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/default-capabilities-arg.md
			}
	*/
	static createTests(args, configTests) {
		const listOfTests = [];

		// tranform the passed arguments into something useful
		const suites = _transform(args);
		suites.forEach(targetSuite => {
			const
				tests = configTests[targetSuite.platform],
				desiredCap = tests.desiredCapabilities,
				configSuite = tests[targetSuite.name];

			// need to appropriately set the correct 'platformName' value
			switch (targetSuite.platform) {
				case 'ios':
					desiredCap.platformName = 'iOS';
				break;

				case 'android':
					desiredCap.platformName = 'Android';

					// for android, appium requires these two properties
					desiredCap.appPackage = configSuite.appPackage;
					desiredCap.appActivity = configSuite.appActivity;
				break;

				case 'windows':
					// NOTE: don't know the actually appium value
					desiredCap.platformName = 'Windows';
				break;
			}

			// needs to be an absolute path to the specified built mobile app
			desiredCap.app = _makeAbs(path.join(targetSuite.name, configSuite.app));

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

/* internal methods  */

/*
	given arguments passed into the script, validate them and convert the
	comma-delimited string into a useful data structure.

	@param {String} arg - a comma delimited string of valid test suites
	@return {Array} - array of json objects; the object properies are defined as:
		{
			abs: absolute path to the test suite in the TEST_DIR,
			name: the name of the test suite,
			platform: the target platform that the test suite is tested against
		}
*/
function _transform(arg) {
	const suites = [];

	const files = arg.split(',');
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
	create an absolute path to a file in the TEST_DIR

	@param {String} file - a file relative to TEST_DIR
	@return {String} - an absolute path to a file in the TEST_DIR
*/
function _makeAbs(file) {
	return path.join(__dirname, '..', TEST_DIR, file);
}