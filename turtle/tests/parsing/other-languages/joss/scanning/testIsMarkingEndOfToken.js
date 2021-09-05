import { isMarkingEndOfToken } from
'../../../../../modules/parsing/other-languages/joss/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['1', '2'], 'out': false},
		{'inArgs': ['1', '.'], 'out': false},
		{'inArgs': ['"', ' '], 'out': false},
		{'inArgs': ['"', '"'], 'out': false},
		{'inArgs': ['1', ' '], 'out': true},
		{'inArgs': ['""', ' '], 'out': true},
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};