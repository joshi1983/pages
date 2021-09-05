import { getArgCountFromScanTokens } from
'../../../../modules/parsing/basic/helpers/getArgCountFromScanTokens.js';
import { scan } from
'../../../../modules/parsing/basic/qbasic/scanning/scan.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function wrappedGetArgCountFromScanTokens(code) {
	const tokens = scan(code);
	return getArgCountFromScanTokens(tokens, 0);
}

export function testGetArgCountFromScanTokens(logger) {
	const cases = [
		{'in': 'f', 'out': 0},
		{'in': 'f()', 'out': 0},
		{'in': 'f(1)', 'out': 1},
		{'in': 'f(1,2)', 'out': 2}
	];
	testInOutPairs(cases, wrappedGetArgCountFromScanTokens, logger);
};