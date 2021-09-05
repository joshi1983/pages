import { isHexNumberLiteral } from
'../../../../../modules/parsing/basic/bbc-basic/scanning/isHexNumberLiteral.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsHexNumberLiteral(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '&', 'out': false},
		{'in': '~', 'out': false},
		{'in': '0', 'out': false},
		{'in': '1', 'out': false},
		{'in': 'a', 'out': false},
		{'in': '~1', 'out': false},
		{'in': ' &1', 'out': false},
		{'in': '&0', 'out': true},
		{'in': '&1', 'out': true},
		{'in': '&10', 'out': true},
		{'in': '&99', 'out': true},

		{'in': '&1a', 'out': true},
		{'in': '&1f', 'out': true},
		{'in': '&a', 'out': true},
		{'in': '&f', 'out': true},
	];
	testInOutPairs(cases, isHexNumberLiteral, logger);
};