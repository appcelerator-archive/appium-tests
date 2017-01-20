'use strict';

class Setup {
	constructor() {
		this.wd = require('wd');
		this.chai = require('chai');
		this.chaiAsPromised = require('chai-as-promised');

		// enabling chai assertion style: https://www.npmjs.com/package/chai-as-promised#node
		this.chai.use(this.chaiAsPromised);
		this.chai.should();
		// enables chai assertion chaining
		this.chaiAsPromised.transferPromiseness = this.wd.transferPromiseness;

		// this object will be assigned in appiumServer()
		this.driver = null;

		this.logOn = false;
	}

	/*
		this function will set the appium server's host and port via config parameter
		and return the object created from webdriver.promiseChainRemote()

		@param {Object} config - appium's configuration object e.g
			{
				host: 'localhost',
				port: 4723
			}

		@return {Object} - returns the object created from webdriver.promiseChainRemote()
	*/
	appiumServer(config) {
		this.driver = this.wd.promiseChainRemote(config);
		return this.driver;
	}

	/*
		this function will do the following:
			- connect the specified mobile device to the appium server
			- install webdriver app to target simulator/emulator/device (specified in the cap object)
			- install the specified built titanium mobile app to target simulator/emulator/device
			- register appium events to print out logs

		@param {Object} cap - appium's capabilities object
		@param {boolean} wLogs - register appium events in order to print out logs to the console
		@return {Promise} - returns a Promise object; typically, should be called in mocha's before method
	*/
	startClient(cap, wLogs) {
		// if logging is enabled, just need to call _logging once i.e. register logging events once
		if (wLogs && !this.logOn) {
			this.logOn = true;
			_logging(this.driver);
		}

		return this.driver.init(cap);
	}

	/*
		@return {Promise} - this function will stop the connection between the mobile
		client and appium server. also, will return a Promise object; typically,
		will be used in mocha's after method
	*/
	stopClient() {
		return this.driver.quit();
	}

	/*
		@return {Webdriver} - returns an instance of the webdriver module;
		useful to access the asserters property (e.g. webdriver.asserters.isDisplayed)
		or SPECIAL_KEYS object (e.g. webdriver.SPECIAL_KEYS['Back space'])
	*/
	getWd() {
		return this.wd;
	}
}

module.exports = Setup;

/*
	an internal method used strictly by startClient() to register the different
	appium events for logging purposes.

	@param {Object} driver - the object returned from webdriver.promiseChainRemote()
*/
function _logging(driver) {
	driver.on('status', info => {
		console.log(info);
	});
	driver.on('command', (meth, path, data) => {
		console.log(` > ${meth} ${path} ${data || ''}`);
	});
	driver.on('http', (meth, path, data) => {
		console.log(` > ${meth} ${path} ${data || ''}`);
	});
}