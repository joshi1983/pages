import { isUnfiniteNum } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/isUnfiniteNum.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsUnfiniteNum(logger) {
	const cases = [
		{'in': 'int', 'out': false},
		{'in': 'num', 'out': false},
		{'in': 'num(finite)', 'out': false},
		{'in': 'num(finite,min=0)', 'out': false},
		{'in': 'num(finite,min=-10)', 'out': false},
		{'in': 'num(unfinite)', 'out': true},
		{'in': 'num(unfinite,min=-infinity)', 'out': true},
			// should simplify to num(unfinite) but should still get true from that.

		{'in': 'num(unfinite,min=infinity)', 'out': true},
		{'in': 'num(unfinite,min=infinity)|string', 'out': false},
		{'in': 'num(finite)|string', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'bool|num', 'out': false},
		{'in': 'bool|num(finite)', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false},
	];
	testInOutPairs(cases, isUnfiniteNum, logger);
};