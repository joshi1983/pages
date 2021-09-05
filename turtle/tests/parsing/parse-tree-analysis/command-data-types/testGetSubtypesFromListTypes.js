import { getSubtypesFromListTypes } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/getSubtypesFromListTypes.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testGetSubtypesFromListTypes(logger) {
	const cases = [
		{'in': 'alphacolorlist', 'out': 'int'},
		{'in': 'alphacolorlist|colorlist', 'out': 'int'},
		{'in': 'colorlist', 'out': 'int'},
		{'in': 'colorlist|string', 'out': 'int'},
		{'in': 'colorlist|list<plist>|string', 'out': 'int|plist'},
		{'in': 'list<int>', 'out': 'int'},
		{'in': 'list<num>', 'out': 'num'},
		{'in': 'list<bool|list|num>', 'out': 'bool|list|num'},
		{'in': 'list<bool|list|num>|plist|transparent', 'out': 'bool|list|num'}
	];
	testInOutPairs(cases, getSubtypesFromListTypes, logger);
};