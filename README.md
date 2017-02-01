# appium-tests

Tool to run Titanium mobile tests in Appium.

# Caveats

* This has not been tested on a Windows machine. Only on macOS.
  * This part needs to be vetted: https://github.com/appium/appium/blob/master/docs/en/appium-setup/running-on-windows.md
* This has not been tested against a Windows mobile platform.
  * Document for Windows mobile platform (needs to be vetted): https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/windows-app-testing.md
* Genymotion needs to be installed in the `Application` folder.
  * Emulators need to be added to Genymotion.
* Xcode should be installed.
* Appc CLI should be installed and you are logged in.

# Setup

1. Make sure you have node >= 4 and npm >= 3.
2. In this directory, run `npm install`.
3. Next, install `appium-doctor`: `[sudo] npm install -g appium-doctor`.
4. Run `appium-doctor` to ensure your machine is properly setup for appium testing.

# Flag Usage

* `node run.js`
  * Run all tests in the `tests` directory.
* `node run.js --suites <suites>`
  * Run only the specified test suites e.g.

  ```
  node run.js --suites Slider/ios.js -> run only the iOS Slider test suite

  node run.js --suites Slider/ios.js,Slider/android.js -> run both the iOS and Android slider test suites.
  ```
* `node run.js --suites <suites> --use-sdk <ti_sdk>`
  * Before running the specified test suites, rebuild the test app with the specified `ti_sdk`.
  * This probably won't be useful if you are running this on your local machine. But, will be useful in a Jenkins build.
* `node run.js --suites <suites> --more-logs`
  * Run the specified test suites with logs enabled; this can become very noisy.
* Below is the complete list of flags:

  ```
  Options:

  	-h, --help          output usage information
  	--suites <suites>   comma-delimited string of valid test suites; otherwise, run all tests
  	--use-sdk <ti_sdk>  build all test apps with the specified Titanium SDK
  	--more-logs         enables more logging; this becomes very noisy
  ```

# How to Write Tests

### 1. Test Suite Structure

All test suites live in the `tests` directory and should have the following folder structure:

```
tests/
|--- suite_name/
	 |--- test_app/
	 |--- platform.js
	 |--- platform2.js
...
```

**Info:**
* `suite_name` should be an API supported by Titanium SDK or Hyperloop e.g. `Slider`.
* `test_app` should be a Titanium Classic, Alloy, or Hyperloop enabled project.
* `platform.js` is a mocha file that will execute test cases (via Appium) in the `test_app` on the designated mobile platform.
* It's important that the `platform.js` file name is a valid platform (`ios.js` or `android.js`), since it tells this tool which mobile platform to use when: installing the `test_app` and running the tests.

### 2. test_config.js

The `test_config.js` file (which lives at the root of this project) contains information about all the test suites and which Appium server to connect to.

High-level notes:

```
module.exports = {
	// this will connect to the local running appium server; you can leave as-is
	server: {
		host: 'localhost',
		port: 4723
	},

	// this tracks all the test suites (per platform) in the 'tests' directory
	tests: {
		ios: {

			// these are properties straight from appium and more are defined here:
			// https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/default-capabilities-arg.md
			desiredCapabilities: {
				automationName: 'XCUITest' // leave as-is for ios
			},

			// the suite_name folder should exist in the 'tests' directory
			suite_name: {
				proj: 'SAMPLE', // name of the 'test_app'

				// list of simulators you want the test app to run against
				testDevices: [
					{
						deviceName: 'iPhone 7 Plus', // the simulator created in xcode
						platformVersion: '10.2' // the platform version associated with the simulator
					},
					...
				]
			},

			suite_name2: { ... }
			...
		},

		android: {
			desiredCapabilities: {
				automationName: 'Appium' // leave as-is for android
			},
			suite_name: {
				proj: 'SAMPLE',

				// these two properties are needed when testing against android
				appPackage: 'com.company.name',
				appActivity: '.SomeActivity',

				// list of genymotion emulators you want the test app to run against
				testDevices: [
					{
						deviceName: 'Custom Phone - 6.0.0 - API 23 - 768x1280', // the genymotion emulator created in the genymotion app
						platformVersion: '6.0' // the platform version associated with the emulator
					},
					...
				]
			}
		}

		// other platforms can be added in the future
	}
};
```

Actual:

```
module.exports = {
	server: {
		host: 'localhost',
		port: 4723
	},
	tests: {
		ios: {
			desiredCapabilities: {
				automationName: 'XCUITest',
				noReset: true
			},
			Slider: {
				proj: 'KitchenSink',
				testDevices: [
					{
						deviceName: 'iPhone 7 Plus',
						platformVersion: '10.2'
					},
					{
						deviceName: 'iPhone 7',
						platformVersion: '10.1'
					}
				]
			}
		},
		android: {
			desiredCapabilities: {
				automationName: 'Appium',
				noReset: true
			},
			Slider: {
				proj: 'KitchenSink',
				appPackage: 'com.appcelerator.kitchensink',
				appActivity: '.KitchensinkActivity',
				testDevices: [
					{
						deviceName: 'Custom Phone - 6.0.0 - API 23 - 768x1280',
						platformVersion: '6.0'
					},
					{
						deviceName: 'Custom Phone - 7.0.0 - API 24 - 768x1280',
						platformVersion: '7.0'
					}
				]
			}
		}
	}
};
```

### 3. Mocha Files

To write the Appium test cases, you will need to be familiar with mocha and Promises. Look at https://github.com/appcelerator/qe-appium/tree/master/test for examples.

Couple notes about those examples vs these test suites:
* The `driver` and `webdriver` property is exposed to the test suite through the `global` variable.
  * Look at [ios.js](./tests/Slider/ios.js#L3-L5).
* You don't need a setup or teardown phase like here https://github.com/appcelerator/qe-appium/blob/master/test/ks_ios_test.js#L9-L39.

# Main Loop

`run.js` is the entry point file and contains the main loop, which does the following:

1. `runAppium()` - launches the local Appium server.
2. `buildTestApps()` - if `--use-sdk` flag is passed, then build all the test apps before moving onto the next task.
3. `createTests()` - create a data structure from `--suites` and loop through the data structure. While looping:
  1. `launchGeny()` - if the test app needs to be tested on an Android platform, launch the designated Genymotion emulator first. iOS simulators will be launched in the next step by Appium.
  2. `startClient()` - after the simulator/genymotion is launched, install the test app to the device and connect to the Appium local server.
  3. `new Mocha().addFile().run()` - run the associated mocha test suite.
  4. `stopClient()` - after a mocha test suite is finished running, disconnect the mobile device from the Appium local server. Depending on the `desiredCapabilities`, iOS simulators can be left running or killed.
  5. `quitGeny()` - if a Genymotion emulator is launched, gracefully kill the process.
4. `kill()` - after all the test suites are executed, kill the Appium local server.
