import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testDataTypesToEnglish } from './testDataTypesToEnglish.js';
import { testGetListOrStringExpressionFromArg } from './testGetListOrStringExpressionFromArg.js';
import { testValuesToStringExpression } from './testValuesToStringExpression.js';

export function testCommandDetails(logger) {
	testDataTypesToEnglish(prefixWrapper('testDataTypesToEnglish', logger));
	testGetListOrStringExpressionFromArg(prefixWrapper('testGetListOrStringExpressionFromArg', logger));
	testValuesToStringExpression(prefixWrapper('testValuesToStringExpression', logger));
};