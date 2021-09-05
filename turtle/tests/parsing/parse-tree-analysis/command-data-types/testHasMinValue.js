import { DataTypes } from
'../../../../modules/parsing/data-types/DataTypes.js';
import { hasMinValue } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/hasMinValue.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
await DataTypes.asyncInit();

export function testHasMinValue(logger) {
	const cases = [
		{'in': 'int', 'out': false},
		{'in': 'num', 'out': false},
		{'in': 'num(finite)', 'out': false},
		{'in': 'num(finite,min=0)', 'out': true},
		{'in': 'num(finite,min=-10)', 'out': true},
		{'in': 'num(unfinite)', 'out': false},
		{'in': 'num(unfinite,min=-infinity)', 'out': false},
			// -infinity is the most negative possible value so it is not considered a minimum at all.
		{'in': 'num(unfinite,min=infinity)', 'out': true},
		{'in': 'num(unfinite,min=infinity)|string', 'out': true},
		{'in': 'num(finite)|string', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'bool|num', 'out': false},
		{'in': 'bool|num(finite)', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false},
	];
	testInOutPairs(cases, hasMinValue, logger);
};