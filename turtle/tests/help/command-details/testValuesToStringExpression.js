import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { valuesToStringExpression } from '../../../modules/help/command-details/valuesToStringExpression.js';

export function testValuesToStringExpression(logger) {
	const cases = [
		{'in': [0], 'out': '0'},
		{'in': [1, 2], 'out': '1 or 2'},
		{'in': [1, 2, 3], 'out': '1, 2 or 3'}
	];
	testInOutPairs(cases, valuesToStringExpression, logger);
};