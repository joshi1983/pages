import { testInOutPairs } from
'../helpers/testInOutPairs.js';
import { URLUtils } from
'../../modules/components/URLUtils.js';
import { wrapAndCall } from
'../helpers/wrapAndCall.js';

function testComputeRelativeURL(logger) {
	const cases = [
		{'inArgs': ['./bla.js', 'test.js'], 'out': 'test.js'},
		{'inArgs': ['bla.js', 'test.js'], 'out': 'test.js'},
		{'inArgs': ['a/bla.js', 'test.js'], 'out': 'a/test.js'},
		{'inArgs': ['a/bla.js', '../test.js'], 'out': 'test.js'}
	];
	testInOutPairs(cases, URLUtils.computeRelativeURL, logger);
}

export function testURLUtils(logger) {
	wrapAndCall([
		testComputeRelativeURL
	], logger);
};