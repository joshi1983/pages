import { isFiniteNum } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/isFiniteNum.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsFiniteNum(logger) {
	const cases = [
		{'in': 'int', 'out': true},
		{'in': 'num', 'out': false},
		{'in': 'num(finite)', 'out': true},
		{'in': 'num(finite,min=0)', 'out': true},
		{'in': 'num(finite,min=-10)', 'out': true},
		{'in': 'num(unfinite)', 'out': false},
		{'in': 'num(unfinite,min=infinity)', 'out': false},
		{'in': 'num(finite)|string', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'bool|num', 'out': false},
		{'in': 'bool|num(finite)', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false},
		/* must not have anything but a num in it. lists are not numbers. */
	];
	testInOutPairs(cases, isFiniteNum, logger);
};