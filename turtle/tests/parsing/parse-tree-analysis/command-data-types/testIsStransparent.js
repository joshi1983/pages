import { isStransparent } from '../../../../modules/parsing/parse-tree-analysis/command-data-types/isStransparent.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsStransparent(logger) {
	const cases = [
		{'in': 'int', 'out': false},
		{'in': 'num', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'string', 'out': true},
		{'in': 'alphacolorstring', 'out': true},
		{'in': 'colorstring', 'out': true},
		{'in': 'alphacolorstring|transparent', 'out': true},
		{'in': 'colorstring|transparent', 'out': true},
		{'in': 'transparent', 'out': true},
		{'in': 'string|transparent', 'out': true},
		{'in': 'list|transparent', 'out': false}, /* intersects with string|transparent but lists are not part of string|transparent. */
		{'in': 'list|num', 'out': false},
	];
	testInOutPairs(cases, isStransparent, logger);
};