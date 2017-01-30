'use strict';

const ConfigTests = require('../test_config.js').tests;

const
	path = require('path'),
	fs = require('fs'),
	spawn = require('child_process').spawn,
	os = require('os');

const TEST_DIR = 'tests';

class Helper {
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
		starts and run the local appium server.

		@param {Object} server - the server property from test_config.js
		@param {Function} done - the callback to call when the server is up and running
		@return {ChildProcess} - returns a ChildProcess to be killed later
	*/
	static runAppium(server, done) {
		const
			cmd = path.join(__dirname, '..', 'node_modules', '.bin', 'appium'),
			flags = ['--log-no-colors']; // no colors from the appium server

		const appiumProc = spawn(cmd, flags);

		appiumProc.stdout.on('data', output => {
			const line = output.toString().trim();

			const
				regStr = `started on (0\\.0\\.0\\.0|${server.host})\\:${server.port}$`,
				isRunning = new RegExp(regStr, 'g').test(line);
			if (isRunning) {
				console.log(`Local Appium server started on ${server.host}:${server.port}`);
				done();
			}

			const isShutDown = '[Appium] Received SIGTERM - shutting down' === line;
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
		if --use-sdk flag is used, then the following will occur:
			1. Run 'appc ti sdk select <ti_sdk>', regardless if the ti sdk is already selected
			2. Modify and save the target tiapp.xml with <ti_sdk>
			3. Run 'appc ti clean' per platform
			4. Then, run 'appc run --build-only' per platform

		this method assumes that the machine has appc cli installed and logged in.

		@param {Array} suites - the data structure from transform() method
		@param {String} tiSdk - titanium sdk passed with the --use-sdk flag
		@param {Boolean} moreLogs - if --more-logs flag is passed, then print out the ChildProcess's stdout and stderr
		@param {Function} done - the promise resolve function to call once the task is done
	*/
	static buildTestApps(suites, tiSdk, moreLogs, done) {
		// if --use-sdk flag was not called, do nothing
		if (!tiSdk) {
			return done();
		}

		// in test_config.js, the same titanium/alloy app can appear per platform per suite.
		// so, will need to track which project's tiapp.xml has already been modified
		const tiappMod = {};

		let p = new Promise(resolve => {
			// run 'appc ti sdk select' regardless if the correct ti sdk is selected
			appc(['ti', 'sdk', 'select', tiSdk], resolve);
		});

		suites.forEach(targetSuite => {
			p = p.then(() => {
				const
					tiProj = ConfigTests[targetSuite.platform][targetSuite.name].proj,
					tiProjDir = _makeAbs(path.join(targetSuite.name, tiProj));

				// only change the tiapp.xml if it hasn't been modified
				if (!tiappMod[tiProj]) {
					tiappMod[tiProj] = true;
					const tiappXmlFile = path.join(tiProjDir, 'tiapp.xml');
					change(tiappXmlFile);
				}

				// this will be used by other appc commands; passing it down the promise chain
				return tiProjDir;
			})
			.then(tiProjDir => {
				return new Promise(resolve => {
					// run 'appc ti clean' and target only the specified platform suite
					// shouldn't clean the build directory needlessly because the other built app is probably still good
					appc([
						'ti', 'clean',
						'--platforms', targetSuite.platform,
						'--project-dir', tiProjDir
					],
					resolve);
				})
				.then(() => {
					return tiProjDir;
				});
			})
			.then(tiProjDir => {
				// run 'appc run --build-only'; for simulator/emulator only
				return new Promise(resolve => {
					appc([
						'run',
						'--platform', targetSuite.platform,
						'--project-dir', tiProjDir,
						'--build-only'
					], resolve);
				});
			});
		});

		// don't need a Promise.catch() here; the outer promise will catch errors
		p.then(() => {
			done();
		});

		// modify the tiapp.xml with the specified titanium sdk from --use-sdk flag
		function change(tiappXml) {
			let xml = fs.readFileSync(tiappXml, {encoding: 'utf8'}).trim();

			const
				oldSdkXml = xml.match(/<sdk\-version>.+<\/sdk\-version>/g)[0],
				newSdkXml = `<sdk-version>${tiSdk}</sdk-version>`;

			xml = xml.replace(oldSdkXml, newSdkXml);
			fs.writeFileSync(tiappXml, xml);
		}

		// run different appc commands
		function appc(flags, next) {
			// no fancy stuff
			flags = flags.concat('--no-colors', '--no-banner', '--no-services');

			// assume that the machine has appc cli and is already logged in
			console.log(`Running: 'appc ${flags.join(' ')}' ...`);
			const appcCmd = spawn('appc', flags);

			// appc cli will print to stdout and stderr regardless of severity
			// hence, using the same callback
			appcCmd.stdout.on('data', spawnCb);
			appcCmd.stderr.on('data', spawnCb);

			appcCmd.on('exit', () => {
				console.log('done');
				next();
			});

			function spawnCb(output) {
				if (moreLogs) {
					console.log(output.toString().trim());
				}
			}
		}
	}

	/*
		launch the specified genymotion emulator if it is defined in your genymotion app.

		NOTE:
			- this will only work in macOS; need to find out a way to make this work on windows
			- this assumes that you have genymotion and virtualbox installed on the machine

		@param {String} genyDevice - the genymotion emulator used for testing
		@param {Function} done - the Promise resolve function; called only when this task is done
		@param {Function} stop - the Promise reject function; called when runtime errors appear in this promise chain
	*/
	static launchGeny(genyDevice, done, stop) {
		new Promise((resolve, reject) => {
			// check if the specified genymotion emulator is in genymotion app
			const
				VBOX_MANAGE = 'VBoxManage',
				flags = ['list', 'vms'];

			const listVmsCmd = spawn(VBOX_MANAGE, flags);

			let output = '';
			listVmsCmd.stdout.on('data', chunk => {
				output += chunk;
			});

			listVmsCmd.stderr.on('data', output => {
				console.log(output.toString());
			});

			listVmsCmd.on('exit', () => {
				const
					regExp = new RegExp(`^"${genyDevice}"`, 'm'),
					deviceExist = regExp.test(output.trim());

				if (!deviceExist) {
					reject(new Error(`"${genyDevice}" doesn't exist; make sure to add it in genymotion.`));
					return;
				}
				resolve();
			});
		})
		.then(() => {
			return new Promise(resolve => {
				// launch genymotion emulator via player
				const
					PLAYER = '/Applications/Genymotion.app/Contents/MacOS/player.app/Contents/MacOS/player',
					flags = ['--vm-name', genyDevice],
					playerCmd = spawn(PLAYER, flags);

				// the spawned player prints to stdout and stderr, but the correct log information won't appear until you manually kill genymotion emulator.
				// so, going to use a ReadStream; seems faster than using fs.readFileSync
				const playerLog = path.join(os.homedir(), '.Genymobile', 'Genymotion', 'deployed', genyDevice, 'genymotion-player.log');

				// sometimes, genymotion-player.log will not exist because genymotion have not been ran yet on the machine.
				// this will wait for the log file to be created so we can watch it.
				let logWatch = null;
				while (!logWatch) {
					try {
						logWatch = fs.watch(playerLog);
					}
					catch (err) { /* do nothing */ }
				}

				// hmmm, this part doesn't seem efficient, but will do for now
				logWatch.on('change', () => {
					fs.createReadStream(playerLog)
					.on('data', output => {
						const matches = output.toString().trim().match(/\w+ \d+ \d+\:\d+\:\d+ .+/g);
						if (matches) {
							const
								// try to grab the last line from the file
								lastLine = matches[matches.length - 1],
								// capture the timestamp that is prefixed in the log per line
								dateTime = lastLine.match(/^\w+ \d+|\d+\:\d+\:\d+/g),
								// create a valid date string for Date.parse; need to add the current year after date
								fullDateTime = `${dateTime[0]} ${new Date().getFullYear()} ${dateTime[1]}`;

							const
								logTime = Date.parse(fullDateTime),
								deltaTime = Date.now() - logTime;

							// if the timestamp is within 1 second of current time and log ends with 'Connected' (launched), then move to next task
							if (deltaTime <= 1000 && /Connected$/g.test(lastLine)) {
								logWatch.close();
								resolve();
							}
						}
					});
				});
			});
		})
		.then(() => {
			done();
		})
		.catch(err => {
			stop(err);
		});
	}

	/*
		kills the genymotion emulator by running the applescript: 'quit app "player"'

		if you were to send kill signals to the "player" process (from launchGeny()),
		then genymotion will not be able to handle those signals, i.e. the player process will be killed,
		but the VBox processes will still be alive and "adb devices" will persist the android emulator (both launched by "player").
		this will cause the next launch of genymotion emulator to be unsuccessful.

		by running this applescript, it will make genymotion emulator die gracefully.

		NOTE: this will only work on macOS because of osascript; will need to find a way on windows

		@param {Function} done - Promise resolve function to call when this task is done
	*/
	static quitGeny(done) {
		const
			appleScript = 'osascript',
			flags = ['-e', 'quit app "player"'],
			appleCmd = spawn(appleScript, flags);

		appleCmd.on('exit', () => {
			done();
		});
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