import { isMarkingEndOfToken } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['.', 'E'], 'out': true},
		{'inArgs': ['.', '.'], 'out': false},
		{'inArgs': ['map', '['], 'out': true},
		{'inArgs': ['&', '&'], 'out': false},
		{'inArgs': ['|', '|'], 'out': false},
		{'inArgs': ['+', '+'], 'out': false},
		{'inArgs': ['-', '-'], 'out': false},
		{'inArgs': ['-', '='], 'out': false},
		{'inArgs': ['-1', '^'], 'out': true},
		{'inArgs': ['-1', '*'], 'out': true},
		{'inArgs': ['-1', '/'], 'out': true},
		{'inArgs': ['-1', '<'], 'out': true},
		{'inArgs': ['-1', '>'], 'out': true},
		{'inArgs': ['-1', '\\'], 'out': true},
		{'inArgs': ['-1', '&'], 'out': true},
		{'inArgs': ['-1', '|'], 'out': true},
		{'inArgs': ['-1', ','], 'out': true},
		{'inArgs': ['^', '3'], 'out': true},
		{'inArgs': ['...', 'i'], 'out': true},
		{'inArgs': ['...', ')'], 'out': true},
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};