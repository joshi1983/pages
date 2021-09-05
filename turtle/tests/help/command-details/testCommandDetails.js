import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testGetListOrStringExpressionFromArg } from './testGetListOrStringExpressionFromArg.js';
import { testValuesToStringExpression } from './testValuesToStringExpression.js';

export function testCommandDetails(logger) {
	testGetListOrStringExpressionFromArg(prefixWrapper('testGetListOrStringExpressionFromArg', logger));
	testValuesToStringExpression(prefixWrapper('testValuesToStringExpression', logger));
};