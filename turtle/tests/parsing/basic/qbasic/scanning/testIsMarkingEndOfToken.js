import { isMarkingEndOfToken } from
'../../../../../modules/parsing/basic/qbasic/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['', '&'], 'out': false},
		{'inArgs': ['&', '0'], 'out': false},
		{'inArgs': ['&', 'H'], 'out': false},
		{'inArgs': ['i&', '&'], 'out': false},
		{'inArgs': ['i', '%'], 'out': false},
		{'inArgs': ['i', '~'], 'out': false},
		{'inArgs': ['i', '!'], 'out': false},
		{'inArgs': ['i', '#'], 'out': false},
		{'inArgs': ['i', '$'], 'out': false},
		{'inArgs': ['<', '>'], 'out': false},
		{'inArgs': ['<', '='], 'out': false},
		{'inArgs': ['>', '='], 'out': false},
		{'inArgs': ['n', 'u'], 'out': false},
		{'inArgs': ['-', '1'], 'out': false}, // -1 would be a good complete token.
		{'inArgs': ['-', '.'], 'out': false}, // might be part of a token like -.23
		{'inArgs': ['–', '1'], 'out': false}, // – looks like - but it is different.
		{'inArgs': ['–', '.'], 'out': false}, // might be part of a token like -.23
		{'inArgs': ['*', '3'], 'out': true},
		{'inArgs': ['i&&', '&'], 'out': true}, // QB64 supports a && suffix but not a triple ampersand.
		{'inArgs': ['>', '5'], 'out': true},
		{'inArgs': ['>', '-'], 'out': true},
		{'inArgs': ['>', '–'], 'out': true}, // – looks like - but it is different.
		{'inArgs': ['=', '-'], 'out': true},
		{'inArgs': ['=', '–'], 'out': true}, // – looks like - but it is different.
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};