import { isCompleteNumberLiteral } from '../../../../modules/parsing/js-parsing/scanning/isCompleteNumberLiteral.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteNumberLiteral(logger) {
	const cases = [
		{'in': 'a', 'out': false},
		{'in': '~', 'out': false},
		{'in': '-a', 'out': false},
		{'in': '-1.a', 'out': false},
		{'in': '-1.1a', 'out': false},
		{'in': '1.12,', 'out': false},
		{'in': '1.12e', 'out': false},
		{'in': '1.12e-', 'out': false},
		{'in': '1.12e-4', 'out': true},
		{'in': '1.12e5', 'out': true},
		{'in': '-', 'out': false},
		{'in': '-0', 'out': true},
		{'in': '0', 'out': true},
		{'in': '1', 'out': true},
		{'in': '1.', 'out': true},
		{'in': '1.12', 'out': true},
		{'in': '-1.12', 'out': true},
		{'in': '0x', 'out': false},
		{'in': '0x1', 'out': true},
		{'in': '0xf', 'out': true},
		{'in': '0xF', 'out': true},
	];
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
};