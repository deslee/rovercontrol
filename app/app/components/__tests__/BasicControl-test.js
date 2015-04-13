jest.dontMock('../BasicControl.js');

describe('BasicControl', function() {
	it('is a generic component', function() {
		var React = require('react/addons');
		var BasicControl = require('../BasicControl.js');
		var TestUtils = React.addons.TestUtils;

		var Component = TestUtils.renderIntoDocument(
			<BasicControl />
		);

		expect(true).toBe(true);
	});
});
