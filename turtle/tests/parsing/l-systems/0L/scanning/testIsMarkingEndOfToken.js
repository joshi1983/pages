import { isMarkingEndOfToken } from
'../../../../../modules/parsing/l-systems/0L/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['-', '1', false], 'out': false},
		{'inArgs': ['.', '-', false], 'out': true}
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};