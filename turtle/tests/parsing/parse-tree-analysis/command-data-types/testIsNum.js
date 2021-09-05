import { isNum } from '../../../../modules/parsing/parse-tree-analysis/command-data-types/isNum.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsNum(logger) {
	const cases = [
		{'in': 'int', 'out': true},
		{'in': 'num', 'out': true},
		{'in': 'bool', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false}, /* must not have anything but a num in it. lists are not numbers. */
	];
	testInOutPairs(cases, isNum, logger);
};