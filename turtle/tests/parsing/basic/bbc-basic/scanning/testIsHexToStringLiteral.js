import { isHexToStringLiteral } from
'../../../../../modules/parsing/basic/bbc-basic/scanning/isHexToStringLiteral.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsHexToStringLiteral(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '&', 'out': false},
		{'in': '~', 'out': false},
		{'in': '~&', 'out': false},
		{'in': '1', 'out': false},
		{'in': '12', 'out': false},
		{'in': ' ~&1', 'out': false},
		{'in': '~&1', 'out': true},
		{'in': '~&12', 'out': true},
		{'in': '~&99', 'out': true},
		{'in': '~&9a', 'out': true},
		{'in': '~&a', 'out': true}
	];
	testInOutPairs(cases, isHexToStringLiteral, logger);
};