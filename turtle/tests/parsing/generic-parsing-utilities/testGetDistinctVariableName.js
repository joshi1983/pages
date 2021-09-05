import { getDistinctVariableName } from
'../../../modules/parsing/generic-parsing-utilities/getDistinctVariableName.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testGetDistinctVariableName(logger) {
	const cases = [
	{'inArgs': ['p', new Set()], 'out': 'p'},
	{'inArgs': ['p', new Set(['p'])], 'out': 'p1'},
	{'inArgs': ['p', new Set(['p', 'p1'])], 'out': 'p2'},
	{'inArgs': ['p', new Set(['P'])], 'out': 'p'},
	];
	testInOutPairs(cases, getDistinctVariableName, logger);
};