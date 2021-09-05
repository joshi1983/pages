import { testGetAnalyzedVariables } from './testGetAnalyzedVariables.js';
import { testGetBaseIndexForArrayVariableAtToken } from './testGetBaseIndexForArrayVariableAtToken.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testVariables(logger) {
	wrapAndCall([
		testGetAnalyzedVariables,
		testGetBaseIndexForArrayVariableAtToken
	], logger);
};