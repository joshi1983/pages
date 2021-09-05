import { isStartOfDocString } from
'../../../../modules/parsing/python-parsing/scanning/isStartOfDocString.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsStartOfDocString(logger) {
	const cases = [
		{'inArgs': ['', 0], 'out': false},
		{'inArgs': ['"', 0], 'out': false},
		{'inArgs': ['""', 0], 'out': false},
		{'inArgs': ['\'', 0], 'out': false},
		{'inArgs': ['\'\'', 0], 'out': false},
		{'inArgs': [' """', 0], 'out': false},
		{'inArgs': ['"""', 0], 'out': true},
		{'inArgs': ['\'\'\'', 0], 'out': true},
		{'inArgs': [' """', 1], 'out': true},
		{'inArgs': [' \'\'\'', 1], 'out': true},
	];
	testInOutPairs(cases, isStartOfDocString, logger);
};