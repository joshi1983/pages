import { isNonColorList } from '../../../../modules/parsing/parse-tree-analysis/command-data-types/isNonColorList.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsNonColorList(logger) {
	const cases = [
		{'in': undefined, 'out': false},
		{'in': 'int', 'out': false},
		{'in': 'num', 'out': false},
		{'in': 'num(finite)', 'out': false},
		{'in': 'num(unfinite)', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'string(minlen=2)', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},

		// Note the isNONCOLORlist part of the name.
		{'in': 'colorlist', 'out': false},
		{'in': 'alphacolorlist', 'out': false},
		{'in': 'colorlist|list', 'out': false},
		{'in': 'alphacolorlist|list', 'out': false},

		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false}, /* must not have anything but a list in it. lists are not numbers. */
		{'in': 'list', 'out': true},
		{'in': 'list(minlen=999)', 'out': true},
		{'in': 'list<num>', 'out': true},
		{'in': 'list<num>(minlen=3)', 'out': true},
		{'in': 'list<bool>', 'out': true},
		{'in': 'list<bool>(minlen=2)', 'out': true},
		{'in': 'list<transparent>', 'out': true},
		{'in': 'list<alphacolor|list>', 'out': true},
		{'in': 'list<alphacolor|list>(minlen=3)', 'out': true},
	];
	testInOutPairs(cases, isNonColorList, logger);
};