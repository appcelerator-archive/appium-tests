'use strict';

const
	path = require('path'),
	fs = require('fs');

const TEST_DIR = 'tests';

class Helper {
	/*
		checks if the suites exist in the TEST_DIR directory.
		if it doesn't, stop the script; otherwise, return an array of string paths


		@param {String} arg - a comma delimited string of valid test suites
		@return {Array} - array of string paths (test suites)
	*/
	static createSuitePaths(arg) {
		const files = arg.split(',');

		files.forEach(file => {
			// do a simple check to see if the specified test suite exists
			try {
				fs.statSync(path.join(TEST_DIR, file));
			}
			catch (err) {
				console.log(`'${file}' doesn't exist in '${TEST_DIR}' directory.`);
				process.exit(1);
			}
		});

		return files;
	}

	/*
		checks if the platform in the specified suite path is valid.
		if not, stop the script; otherwise, return an array of json objects which contains suite-platform pair

		@param {Array} suitePaths - array of string paths; data from createSuitePaths()
		@return {Array} - array of json objects; each object contains suite-platform pair
	*/
	static createSPs(suitePaths) {
		const listSP = [];

		suitePaths.forEach(onePath => {
			const
				parts = onePath.split(path.sep), // separate path by system's file separator
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
					console.log(`${onePath}: '${platform}' is not a valid platform.`);
					process.exit(1);
			}

			listSP.push({
				suite: suite,
				platform: platform
			});
		});

		return listSP;
	}

	/*
		generates an array of valid appium's desired capability objects

		@param {Array} suitePlatformPairs - an array of suite-platform pair objects; data from createSPs()
		@param {Object} configTests - the 'tests' object from test_config.js
		@return {Array} - an array of valid appium's desired capability objects; https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/default-capabilities-arg.md
	*/
	static createDesires(suitePlatformPairs, configTests) {
		const listOfDesires = [];

		suitePlatformPairs.forEach(pair => {
			const
				tests = configTests[pair.platform],
				desiredCap = tests.desiredCapabilities,
				suite = tests[pair.suite];

			// need to appropriately set the correct 'platformName' value
			switch (pair.platform) {
				case 'ios':
					desiredCap.platformName = 'iOS';
				break;

				case 'android':
					desiredCap.platformName = 'Android';

					// for android, appium requires these two properties
					desiredCap.appPackage = suite.appPackage;
					desiredCap.appActivity = suite.appActivity;
				break;

				case 'windows':
					// NOTE: don't know the actually appium value
					desiredCap.platformName = 'Windows';
				break;
			}

			// needs to be an absolute path to the specified built mobile app
			desiredCap.app = this.makeAbs(path.join(pair.suite, suite.app));

			// it is possible for a test suite to have multiple target test devices
			suite.testDevices.forEach(device => {
				// Object.assign() makes a shallow copy (propertry and values only) of desiredCap object
				const newDesires = Object.assign({}, desiredCap);
				newDesires.deviceName = device.deviceName;
				newDesires.platformVersion = device.platformVersion;
				listOfDesires.push(newDesires);
			});
		});

		return listOfDesires;
	}

	/*
		create an absolute path to a file in the TEST_DIR

		@param {String} file - a file relative to TEST_DIR
		@return {String} - an absolute path to a file in the TEST_DIR
	*/
	static makeAbs(file) {
		return path.join(__dirname, '..', TEST_DIR, file);
	}
}

module.exports = Helper;