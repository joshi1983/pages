import { isMarkingEndOfToken } from
'../../../../modules/parsing/sonic-webturtle/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
	{'inArgs': ['^', 'b'], 'out': false},
	{'inArgs': ['$', 'b'], 'out': false},
	{'inArgs': ['<', '='], 'out': false},
	{'inArgs': ['=', '='], 'out': false},
	{'inArgs': ['a', 'b'], 'out': false},
	{'inArgs': ['2', '3'], 'out': false},
	{'inArgs': ['2', 'e'], 'out': true},
	{'inArgs': ['2', '<'], 'out': true},
	{'inArgs': ['a', '<'], 'out': true},
	{'inArgs': ['+', '<'], 'out': true},
	{'inArgs': ['-', '<'], 'out': true},
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};