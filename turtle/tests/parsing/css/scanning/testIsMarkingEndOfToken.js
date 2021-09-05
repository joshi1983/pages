import { isMarkingEndOfToken } from
'../../../../modules/parsing/css/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
	{'inArgs': ['.', '4'], 'out': false},
	{'inArgs': ['#', '4'], 'out': false},
	{'inArgs': ['#', 'f'], 'out': false},
	{'inArgs': ['#', 'a'], 'out': false},
	{'inArgs': ['#', 'A'], 'out': false},
	{'inArgs': ['.', 'x'], 'out': false},
	{'inArgs': ['.', 'n'], 'out': false},
	{'inArgs': ['.', '_'], 'out': false},
	{'inArgs': ['#', '!'], 'out': true},
	{'inArgs': ['/', 'x'], 'out': true},
	{'inArgs': ['/', '4'], 'out': true},
	{'inArgs': ['*', '4'], 'out': true},
	{'inArgs': ['x', '/'], 'out': true},
	{'inArgs': ['x', '#'], 'out': true},
	{'inArgs': ['p', '#'], 'out': true},
	{'inArgs': ['href', '*'], 'out': true},
	{'inArgs': ['href', '~'], 'out': true},
	{'inArgs': ['href', '$'], 'out': true},
	{'inArgs': ['href', '='], 'out': true},
	{'inArgs': ['$', '='], 'out': false},
	{'inArgs': ['2', '-'], 'out': true},
	{'inArgs': ['2', '.'], 'out': false},
	{'inArgs': ['123', '.'], 'out': false},
	{'inArgs': ['-123', '.'], 'out': false},
	{'inArgs': ['#id1', '.'], 'out': true},
	{'inArgs': ['p', '.'], 'out': true},
	{'inArgs': ['.className1', '.'], 'out': true},
	{'inArgs': ['.className1', ':'], 'out': true},
	{'inArgs': ['p', ':'], 'out': true},
	{'inArgs': ['type', '^'], 'out': true},
	{'inArgs': ['x', '>'], 'out': true},
	{'inArgs': ['>', '='], 'out': false},
	{'inArgs': ['>', 'x'], 'out': true},
	{'inArgs': ['>', '5'], 'out': true},
	{'inArgs': ['>=', 'x'], 'out': true},
	{'inArgs': ['x', '<'], 'out': true},
	{'inArgs': ['<', '='], 'out': false},
	{'inArgs': ['<', 'x'], 'out': true},
	{'inArgs': ['<', '5'], 'out': true},
	{'inArgs': ['<=', 'x'], 'out': true},
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};