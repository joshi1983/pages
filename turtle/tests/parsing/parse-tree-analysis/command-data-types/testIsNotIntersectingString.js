import { DataTypes } from
'../../../../modules/parsing/data-types/DataTypes.js';
import { isNotIntersectingString } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/isNotIntersectingString.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
await DataTypes.asyncInit();

export function testIsNotIntersectingString(logger) {
	const cases = [
		{'in': 'bool', 'out': true},
		{'in': 'alphacolor', 'out': false},
		{'in': 'alphacolorlist', 'out': true},
		{'in': 'alphacolorstring', 'out': false},
		{'in': 'int', 'out': true},
		{'in': 'int(min=0)', 'out': true},
		{'in': 'int(min=0)|num(max=-2)', 'out': true},
		{'in': 'int|string', 'out': false},
		{'in': 'list', 'out': true},
		{'in': 'list(minlen=2)', 'out': true},
		{'in': 'num', 'out': true},
		{'in': 'num(min=0)', 'out': true},
		{'in': 'num|string', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'color', 'out': false},
		{'in': 'colorlist', 'out': true},
		{'in': 'colorstring', 'out': false}
	];
	testInOutPairs(cases, isNotIntersectingString, logger);
};