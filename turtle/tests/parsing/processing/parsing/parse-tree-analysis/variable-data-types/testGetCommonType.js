import { getCommonType } from
'../../../../../../modules/parsing/processing/parsing/parse-tree-analysis/variable-data-types/getCommonType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testGetCommonType(logger) {
	const cases = [
	{'inArgs': ['int', 'long'], 'out': 'int'},
	{'inArgs': [undefined, 'long'], 'out': undefined},
	{'inArgs': ['int', undefined], 'out': undefined},
	{'inArgs': ['int', 'float'], 'out': 'float'},
	{'inArgs': ['short', 'double'], 'out': 'float'},
	{'inArgs': ['A', 'A'], 'out': 'A'},
	];
	testInOutPairs(cases, getCommonType, logger);
};