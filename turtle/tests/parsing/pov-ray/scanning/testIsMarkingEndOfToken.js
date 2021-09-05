import { isMarkingEndOfToken } from
'../../../../modules/parsing/pov-ray/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
	{'inArgs': ['<', '='], 'out': false},
	{'inArgs': ['>', '='], 'out': false},
	{'inArgs': ['.', '4'], 'out': false},
	{'inArgs': ['-.', '4'], 'out': false},
	{'inArgs': ['-.', 'e'], 'out': true},
	{'inArgs': ['+.', 'e'], 'out': true},
	{'inArgs': ['=', '0'], 'out': true},
	{'inArgs': ['!', '='], 'out': false},
	{'inArgs': ['x', '?'], 'out': true},
	{'inArgs': ['?', 'x'], 'out': true},
	{'inArgs': [':', 'x'], 'out': true},
	{'inArgs': ['x', ':'], 'out': true},
	{'inArgs': ['0', '='], 'out': true},
	{'inArgs': ['0', '<'], 'out': true},
	{'inArgs': ['0', '>'], 'out': true},
	{'inArgs': ['+', 'x'], 'out': true},
	{'inArgs': ['-', 'x'], 'out': true},
	{'inArgs': ['*', 'x'], 'out': true},
	{'inArgs': ['/', 'x'], 'out': true},
	{'inArgs': ['3', '|'], 'out': true},
	{'inArgs': ['3', '&'], 'out': true},
	{'inArgs': ['!', 'x'], 'out': true},
	{'inArgs': ['!', '4'], 'out': true},
	{'inArgs': ['!=', 'x'], 'out': true},
	{'inArgs': ['!=', '0'], 'out': true},
	{'inArgs': ['"hi"', '>'], 'out': true},
	{'inArgs': ['#end', '/'], 'out': true},
	{'inArgs': ['.', 'e'], 'out': true},
	{'inArgs': ['.', 'E'], 'out': true},
	{'inArgs': ['.', 'x'], 'out': true},
	{'inArgs': ['.', 'z'], 'out': true},
	{'inArgs': ['.', 'Z'], 'out': true},
	{'inArgs': ['.', '_'], 'out': true},
	{'inArgs': ['.', '-'], 'out': true},
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};