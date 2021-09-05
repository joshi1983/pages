import { isMarkingEndOfToken } from
'../../../../modules/parsing/kojo/scanning/isMarkingEndOfToken.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsMarkingEndOfToken(logger) {
	const cases = [
		{'inArgs': ['<', '-'], 'out': false},
		{'inArgs': ['<-', ' '], 'out': true},
		{'inArgs': ['@deprecated', '('], 'out': true},
		{'inArgs': ['@', 'm'], 'out': false},
	];
	testInOutPairs(cases, isMarkingEndOfToken, logger);
};