import { isMarkingEndOfToken } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['.', 'E'], 'out': true}
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};