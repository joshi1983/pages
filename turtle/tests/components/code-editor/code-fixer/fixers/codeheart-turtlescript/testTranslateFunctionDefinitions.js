import { processTranslateTestCases } from './processTranslateTestCases.js';

export function testTranslateFunctionDefinitions(logger) {
	const cases = [
		{'in': 'function procName1() {}', 'out': '\nto procName1\nend'},
		{'in': 'function p() {}', 'out': '\nto p\nend'},
		{'in': 'function p() {x=4;}', 'out': '\nto p\n\tmake "x 4\nend'},
		// make instead of localmake because x would be a global variable in that JavaScript.
		{'in': 'function p() {var x=4; x = 5;}', 'out': '\nto p\n\tlocalmake "x 4\n\tlocalmake "x 5\nend'},

		{'in': 'function p(x) {}', 'out': '\nto p :x\nend'},
		{'in': 'function p(x,y) {}', 'out': '\nto p :x :y\nend'},
		{'in': 'function p(x) {x = 4}', 'out': '\nto p :x\n\tlocalmake "x 4\nend'},
	];
	processTranslateTestCases(cases, logger);
};