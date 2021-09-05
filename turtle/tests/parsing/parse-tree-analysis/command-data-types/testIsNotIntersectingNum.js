import { DataTypes } from
'../../../../modules/parsing/data-types/DataTypes.js';
import { isNotIntersectingNum } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/isNotIntersectingNum.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
await DataTypes.asyncInit();

export function testIsNotIntersectingNum(logger) {
	const cases = [
		{'in': 'bool', 'out': true},
		{'in': 'alphacolor', 'out': false},
		{'in': 'alphacolorlist', 'out': true},
		{'in': 'alphacolorstring', 'out': true},
		{'in': 'int', 'out': false},
		{'in': 'int(min=0)', 'out': false},
		{'in': 'int(min=0)|num(max=-2)', 'out': false},
		{'in': 'list', 'out': true},
		{'in': 'list(minlen=2)', 'out': true},
		{'in': 'num', 'out': false},
		{'in': 'num(min=0)', 'out': false},
		{'in': 'num|string', 'out': false},
		{'in': 'string', 'out': true},
		{'in': 'color', 'out': false},
		{'in': 'colorlist', 'out': true},
		{'in': 'colorstring', 'out': true}
	];
	testInOutPairs(cases, isNotIntersectingNum, logger);
};