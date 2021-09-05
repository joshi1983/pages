import { isListType } from '../../../../modules/parsing/parse-tree-analysis/command-data-types/isListType.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsListType(logger) {
	const cases = [
		{'in': 'num', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': false},
		{'in': 'string|transparent', 'out': false},
		{'in': 'list|num', 'out': false}, /* must not have anything but a list in it. numbers are not lists. */
		{'in': 'list<num>|string', 'out': false},
		{'in': 'list<num>|num', 'out': false},
		{'in': 'list<num|string>|num', 'out': false},
		{'in': 'alphacolorlist', 'out': true},
		{'in': 'colorlist', 'out': true},
		{'in': 'list<alphacolor>', 'out': true},
		{'in': 'list<num>', 'out': true},
		{'in': 'list<list>', 'out': true},
		{'in': 'list<num|string>', 'out': true},
		{'in': 'list<bool>', 'out': true},
		{'in': 'list<bool|num|string|transparent>', 'out': true},
		{'in': 'list<string>', 'out': true},
	];
	testInOutPairs(cases, isListType, logger);
};