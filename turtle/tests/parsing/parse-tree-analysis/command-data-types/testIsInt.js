import { DataTypes } from '../../../../modules/parsing/data-types/DataTypes.js';
import { isInt } from '../../../../modules/parsing/parse-tree-analysis/command-data-types/isInt.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
await DataTypes.asyncInit();

export function testIsInt(logger) {
	const cases = [
		{'in': 'int', 'out': true},
		{'in': 'int(min=0)', 'out': true},
		{'in': 'int(min=1)', 'out': true},
		{'in': 'int(min=2)', 'out': true},
		{'in': 'int(max=0,min=-10)', 'out': true},
		{'in': 'int(max=10)', 'out': true},
		{'in': 'int(max=10,min=0)|int(max=20,min=15)', 'out': true},
		{'in': 'int(max=10,min=0)|num(max=20,min=15)', 'out': false}, // not int only.
		{'in': 'list|num(finite,max=10,min=0)', 'out': false},
		{'in': 'num', 'out': false},
		{'in': 'num(min=0)', 'out': false},
		{'in': 'num(finite)', 'out': false},
		{'in': 'num(finite,min=0)', 'out': false},
		{'in': 'num(finite,min=-10)', 'out': false},
		{'in': 'num(unfinite)', 'out': false},
		{'in': 'num(unfinite,min=infinity)', 'out': false},
		{'in': 'num(finite)|string', 'out': false}, // needs to be num only to get true.  Strings are not numbers.
		{'in': 'num(finite,max=10,min=0)|num(finite,max=20,min=15)', 'out': false},
		{'in': 'num(finite,max=10,min=0)|num(finite,max=20,min=15)|string', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'bool|num', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false}, /* must not have anything but a num in it. lists are not numbers. */
	];
	testInOutPairs(cases, isInt, logger);
};