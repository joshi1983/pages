import { isNum } from '../../../../modules/parsing/parse-tree-analysis/command-data-types/isNum.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsNum(logger) {
	const cases = [
		{'in': 'int', 'out': true},
		{'in': 'num', 'out': true},
		{'in': 'num(finite)', 'out': true},
		{'in': 'num(finite,min=0)', 'out': true},
		{'in': 'num(finite,min=-10)', 'out': true},
		{'in': 'num(unfinite)', 'out': true},
		{'in': 'num(unfinite,min=infinity)', 'out': true},
		{'in': 'num(finite)|string', 'out': false}, // needs to be num only to get true.  Strings are not numbers.
		{'in': 'bool', 'out': false},
		{'in': 'bool|num', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false}, /* must not have anything but a num in it. lists are not numbers. */
	];
	testInOutPairs(cases, isNum, logger);
};