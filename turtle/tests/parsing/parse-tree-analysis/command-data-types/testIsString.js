import { isString } from
'../../../../modules/parsing/parse-tree-analysis/command-data-types/isString.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsString(logger) {
	const cases = [
	{'in': 'string', 'out': true},
	{'in': 'string(minlen=1)', 'out': true},
	{'in': 'string(minlen=2)', 'out': true},
	{'in': 'string(minlen=3)', 'out': true},
	{'in': 'string|transparent', 'out': false},
	{'in': 'colorstring', 'out': false},
	{'in': 'alphacolorstring', 'out': false}
	];
	testInOutPairs(cases, isString, logger);
};