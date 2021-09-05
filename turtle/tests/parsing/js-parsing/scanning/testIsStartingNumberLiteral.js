import { isStartingNumberLiteral } from '../../../../modules/parsing/js-parsing/scanning/isStartingNumberLiteral.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsStartingNumberLiteral(logger) {
	const cases = [
		{'in': 'a', 'out': false},
		{'in': '~', 'out': false},
		{'in': '-a', 'out': false},
		{'in': '-1.a', 'out': false},
		{'in': '-1.1a', 'out': false},
		{'in': '1.12,', 'out': false},
		{'in': '1.12e', 'out': true},
		{'in': '1.12e-', 'out': true},
		{'in': '1.12e-4', 'out': true},
		{'in': '1.12e5', 'out': true},
		{'in': '-', 'out': true},
		{'in': '- ', 'out': false},
		{'in': '- 1', 'out': false},
		{'in': '-1', 'out': true},
		{'in': '-0', 'out': true},
		{'in': '0', 'out': true},
		{'in': '1', 'out': true},
		{'in': '1.', 'out': true},
		{'in': '1.12', 'out': true},
		{'in': '0xf', 'out': true},
		{'in': '0x', 'out': true},
		{'in': '-0x', 'out': true},
	];
	testInOutPairs(cases, isStartingNumberLiteral, logger);
};