import { isMixTransparentType } from '../../../../modules/parsing/parse-tree-analysis/command-data-types/isMixTransparentType.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsMixTransparentType(logger) {
	const cases = [
		{'in': 'int', 'out': false},
		{'in': 'num', 'out': false},
		{'in': 'bool', 'out': false},
		{'in': 'string', 'out': false},
		{'in': 'transparent', 'out': true},
		{'in': 'colorstring|transparent', 'out': true},
		{'in': 'alphacolorstring|transparent', 'out': true},
		{'in': 'string|transparent', 'out': true},
		{'in': 'num|transparent', 'out': true},
		{'in': 'list|num', 'out': false},
	];
	testInOutPairs(cases, isMixTransparentType, logger);
};