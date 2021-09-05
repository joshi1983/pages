import { getListOrStringExpressionFromArg } from '../../../modules/help/command-details/getListOrStringExpressionFromArg.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testGetListOrStringExpressionFromArg(logger) {
	const cases = [
		{'in': {'types': 'list'}, 'out': 'The list'},
		{'in': {'types': 'string'}, 'out': 'The string'},
		{'in': {'types': 'list|string'}, 'out': 'The list or string'},
		{'in': {'name': 'name1', 'types': 'plist'}, 'out': 'name1'},
		{'in': {'types': 'list<num>'}, 'out': 'The list'},
		{'in': {'types': 'list<num|string>'}, 'out': 'The list'},
		{'in': {'types': 'list<list<num|string>>'}, 'out': 'The list'},
	];
	testInOutPairs(cases, getListOrStringExpressionFromArg, logger);
};