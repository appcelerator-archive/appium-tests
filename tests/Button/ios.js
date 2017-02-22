'use strict';

const
	driver = global.driver,
	webdriver = global.webdriver,
	curDevice = global.curDevice;

const assert = require('assert');

describe('Button', function () {
	// in general, the tests take a while to go through, which will hit mocha's 2 second timeout threshold.
	// set timeout to 5 minutes
	this.timeout(300000);

	it('TIMOB2020', function (done) {
		driver
			.elementByName('TIMOB2020')
			.click()
			.waitForElementsByClassName('XCUIElementTypeButton', webdriver.asserters.isDisplayed, function (err, elements) {
				let p = Promise.resolve();

				elements.forEach(function (elm) {
					p = p.then(function () {
						return new Promise(function (resolve, reject) {
							elm.text(function (err, text) {
								try {
									// done button will be picked up; IGNORE
									if (text !== 'Done') {
										const num = Number.parseInt(text, 10);
										assert.ok(!Number.isNaN(num), `'${text}' is not a number`);
									}
									resolve();
								}
								catch (err) { reject(err); }
							});
						});
					});
				});

				p.then(function () {
					done();
				})
				.catch(done);
			});
	});
});