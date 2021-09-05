import { DataTypes } from
'../../../../modules/parsing/data-types/DataTypes.js';
import { isExclusivelyString } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/isExclusivelyString.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
await DataTypes.asyncInit();

export function testIsExclusivelyString(logger) {
	const cases = [
		{'in': undefined, 'out': false},
		{'in': '', 'out': false},
		{'in': 'alphacolor', 'out': false},
		{'in': 'alphacolorlist', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'color', 'out': false},
		{'in': 'color|list', 'out': false},
		{'in': 'colorlist', 'out': false},
		{'in': 'int', 'out': false},
		{'in': 'list', 'out': false},
		{'in': 'list(minlen=3)', 'out': false},
		{'in': 'num', 'out': false},
		{'in': 'num|string', 'out': false},
		{'in': 'num(max=0)', 'out': false},
		{'in': 'num(min=0)', 'out': false},
		{'in': 'alphacolorstring', 'out': true},
		{'in': 'colorstring', 'out': true},
		{'in': 'string', 'out': true},
		{'in': 'string(minlen=3)', 'out': true},
		{'in': 'cproc', 'out': true},
			// true because a procedure or command name is a string.
	];
	testInOutPairs(cases, isExclusivelyString, logger);
};