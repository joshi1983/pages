import { DataTypes } from
'../../../../modules/parsing/data-types/DataTypes.js';
import { intersectsWithNum } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/intersectsWithNum.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
await DataTypes.asyncInit();

export function testIntersectsWithNum(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'int', 'out': true},
		{'in': 'int(max=0)', 'out': true},
		{'in': 'int(max=0,min=-3)', 'out': true},
		{'in': 'int(min=0)', 'out': true},
		{'in': 'list<num>', 'out': false},
		{'in': 'list<num|string>', 'out': false},
		{'in': 'list<bool|num|string>', 'out': false},
		{'in': 'list<bool|num|string>|string', 'out': false},
		{'in': 'list<bool|num|string>|string|transparent', 'out': false},
		{'in': 'num', 'out': true},
		{'in': 'num(finite)', 'out': true},
		{'in': 'num(finite,min=0)', 'out': true},
		{'in': 'num(finite,max=0)', 'out': true},
		{'in': 'num(finite,max=10,min=0)', 'out': true},
		{'in': 'num|string', 'out': true},
		{'in': 'list|num|string', 'out': true},
		{'in': 'bool|list|num|string', 'out': true},
	];
	testInOutPairs(cases, intersectsWithNum, logger);
};
