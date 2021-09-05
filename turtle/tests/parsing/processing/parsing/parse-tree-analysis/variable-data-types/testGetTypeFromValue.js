import { getTypeFromValue } from
'../../../../../../modules/parsing/processing/parsing/parse-tree-analysis/variable-data-types/getTypeFromValue.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testGetTypeFromValue(logger) {
	const cases = [
	{'in': 4, 'out': 'int'},
	{'in': 4.2, 'out': 'float'},
	{'in': true, 'out': 'boolean'},
	{'in': false, 'out': 'boolean'},
	{'in': 'hello', 'out': 'String'},
	{'in': {}, 'out': 'Object'}
	];
	testInOutPairs(cases, getTypeFromValue, logger);
};