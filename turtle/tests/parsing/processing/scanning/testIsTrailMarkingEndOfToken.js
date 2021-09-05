import { isTrailMarkingEndOfToken } from
'../../../../modules/parsing/processing/scanning/isTrailMarkingEndOfToken.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsTrailMarkingEndOfToken(logger) {
	const cases = [
	{'inArgs': ['1', '2', '3'], 'out': false},
	{'inArgs': ['(', '/', 'x'], 'out': false},// opening brackets like ( immediately before / imply / is not a division operator.
	{'inArgs': ['{', '/', 'x'], 'out': false},
	{'inArgs': ['[', '/', 'x'], 'out': false},
	{'inArgs': ['=', '/', 'x'], 'out': false}, // a = immediately before a / means the / can't be a division operator.
	{'inArgs': [',', '/', 'x'], 'out': false}, // a , immediately before a / means the / can't be a division operator.
	{'inArgs': ['2', '/', 'x'], 'out': true}, // could be division operator
	{'inArgs': ['x', '/', 'x'], 'out': true},
	{'inArgs': ['i', '+', '+'], 'out': false},
	{'inArgs': ['2', '/', '/'], 'out': false},
	{'inArgs': ['2', '/', '*'], 'out': false},
	{'inArgs': ['a', '/', '='], 'out': false},
	{'inArgs': ['/', '=', 'a'], 'out': false},
	{'inArgs': ['x', '/=', 'a'], 'out': true},
	{'inArgs': ['// comment', '/', '['], 'out': false}
	];
	testInOutPairs(cases, isTrailMarkingEndOfToken, logger);
};