import { isAllHexadecimalDigits } from '../../../modules/parsing/parse-tree-analysis/isAllHexadecimalDigits.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testIsAllHexadecimalDigits(logger) {
	const cases = [
		{'in': '', 'out': true},
		{'in': '1', 'out': true},
		{'in': 'f', 'out': true},
		{'in': 'F', 'out': true},
		{'in': 'd', 'out': true},
		{'in': 'D', 'out': true},
		{'in': 'g', 'out': false},
		{'in': '123', 'out': true},
		{'in': '12', 'out': true},
		{'in': 'fff', 'out': true},
		{'in': 'fFf', 'out': true},
		{'in': '1F9', 'out': true}
	];
	testInOutPairs(cases, isAllHexadecimalDigits, logger);
};