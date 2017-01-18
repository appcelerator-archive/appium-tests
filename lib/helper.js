'use strict';

const
	path = require('path'),
	fs = require('fs');

class Helper {
	/*
		checks if the suites exist in the test directory.
		if it doesn't, stop the script; otherwise, return an array of string paths


		@param {String} arg - a comma delimited string of valid test suites
		@return {Array} - array of string paths (test suites)
	*/
	static suitesExists(arg) {
		const TEST_DIR = 'tests';

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

		@param {Array} suitePaths - array of string paths; data from suitesExists()
		@return {Array} - array of json objects; each object contains suite-platform pair
	*/
	static validPlatforms(suitePaths) {
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
				case 'window':
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
}

module.exports = Helper;