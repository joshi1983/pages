import { testDataTypesToEnglish } from './testDataTypesToEnglish.js';
import { testGetListOrStringExpressionFromArg } from './testGetListOrStringExpressionFromArg.js';
import { testProcessCommandInputs } from './testProcessCommandInputs.js';
import { testProcessCommandOutputs } from './testProcessCommandOutputs.js';
import { testProcessExtraCommandInputs } from './testProcessExtraCommandInputs.js';
import { testSimplifyTypes } from './testSimplifyTypes.js';
import { testValuesToStringExpression } from './testValuesToStringExpression.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testCommandDetails(logger) {
	wrapAndCall([
		testDataTypesToEnglish,
		testGetListOrStringExpressionFromArg,
		testProcessCommandInputs,
		testProcessCommandOutputs,
		testProcessExtraCommandInputs,
		testSimplifyTypes,
		testValuesToStringExpression
	], logger);
};