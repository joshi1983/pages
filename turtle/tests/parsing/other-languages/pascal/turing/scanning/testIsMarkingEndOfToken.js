import { isMarkingEndOfToken } from
'../../../../../../modules/parsing/other-languages/pascal/turing/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['1', '2'], 'out': false},
		{'inArgs': ['.', '.'], 'out': false},
		{'inArgs': ['/', '*'], 'out': false},
		{'inArgs': ['/* comment *', '/'], 'out': false},
		{'inArgs': ['/* comment */', 'x'], 'out': true},
		{'inArgs': ['not', '='], 'out': false},
		{'inArgs': ['%', '\n'], 'out': true},
		{'inArgs': ['-', 'x'], 'out': true},
		{'inArgs': ['(', 'x'], 'out': true},
		{'inArgs': [':', ':'], 'out': true}
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};

